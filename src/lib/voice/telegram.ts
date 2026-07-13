/** Best-effort push to Serhii's own Telegram via a bot he owns — no database involved. This is the
 * only persistence for a voice call's "I don't know, I'll ask Serhii" fallback: the Telegram chat
 * history is the record. If it fails, the caller logs it server-side and still tells the visitor
 * their question was noted, rather than surfacing a delivery failure mid-call. */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram bot is not configured.");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) throw new Error(`Telegram sendMessage failed: ${response.status}`);
}
