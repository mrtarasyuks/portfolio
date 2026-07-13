import { NextResponse } from "next/server";
import { z } from "zod";
import { buildVoiceAgentInstructions } from "@/lib/aiAgentContext";
import { SAVE_QUESTION_TOOL } from "@/lib/voice/tools";
import { verifyTurnstileToken } from "@/lib/voice/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/voice/rateLimit";

const MAX_SESSIONS_PER_IP_PER_HOUR = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const sessionRequestSchema = z.object({
  turnstileToken: z.string().min(1),
});

/**
 * Mints a short-lived OpenAI Realtime client secret for the browser's WebRTC call — the real
 * OPENAI_API_KEY never leaves this server. Grounding is the session's own `instructions` field
 * (the same content the text chat is grounded in, see `buildVoiceAgentInstructions`), so there's no
 * separate retrieval endpoint to call mid-session — only `save_question_for_serhii` needs a
 * follow-up request, and that's `/api/voice/unanswered`, called by the browser once the model
 * invokes the tool.
 */
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice call is not configured yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = getClientIp(request);

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed." }, { status: 403 });
  }

  if (!checkRateLimit(`voice-session:${ip}`, MAX_SESSIONS_PER_IP_PER_HOUR, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many calls — try again later." }, { status: 429 });
  }

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        // Verified against OpenAI's current Realtime docs at build time (developers.openai.com) —
        // re-check this against your own dashboard/docs if OpenAI has since renamed or retired it.
        model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
        instructions: buildVoiceAgentInstructions(),
        audio: { output: { voice: "marin" } },
        tools: [SAVE_QUESTION_TOOL],
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Voice call is temporarily unavailable." }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ clientSecret: data.value, expiresAt: data.expires_at });
}
