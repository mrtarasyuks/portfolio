import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAiAgentSystemPrompt } from "@/lib/aiAgentContext";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;
const MODEL = "claude-haiku-4-5-20251001";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
      })
    )
    .min(1)
    .max(MAX_MESSAGES),
});

/**
 * Server-side proxy to the Claude API for the portfolio's "ask about Serhii" chat widget — the API
 * key never reaches the client, same reasoning `docs/design-decisions.md`/CLAUDE.md require for any
 * AI integration on this site. The system prompt (grounded in the site's own profile/project/copy
 * content, see `buildAiAgentSystemPrompt`) is rebuilt per request rather than cached, since it's
 * cheap to build and this way it never goes stale if content changes.
 */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI chat is not configured yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: buildAiAgentSystemPrompt(),
      messages: parsed.data.messages,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "The AI chat is temporarily unavailable." }, { status: 502 });
  }

  const data = await response.json();
  const reply = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  return NextResponse.json({ reply });
}
