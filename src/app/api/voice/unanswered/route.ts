import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTelegramMessage } from "@/lib/voice/telegram";
import { checkRateLimit, getClientIp } from "@/lib/voice/rateLimit";

const MAX_PER_IP_PER_HOUR = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const unansweredSchema = z.object({
  question: z.string().min(1).max(500),
  conversationSummary: z.string().max(300).optional(),
  language: z.string().min(1).max(10),
});

/** Called by the browser when the voice agent invokes `save_question_for_serhii` mid-call. No
 * Supabase table here (there isn't one in this repo) — the question goes straight to Serhii's own
 * Telegram, which is the persistent record. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = unansweredSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`voice-unanswered:${ip}`, MAX_PER_IP_PER_HOUR, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { question, conversationSummary, language } = parsed.data;
  const text = [
    "🎙 New voice-call question from the portfolio site:",
    `Q: ${question}`,
    conversationSummary ? `Context: ${conversationSummary}` : null,
    `Language: ${language}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendTelegramMessage(text);
  } catch (err) {
    console.error("Failed to send voice-call Telegram notification", err);
  }

  return NextResponse.json({ success: true });
}
