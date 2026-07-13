/** Verifies a Cloudflare Turnstile token server-side before a voice session is minted — a public
 * button that starts a per-minute-billed OpenAI Realtime session is a real cost/abuse target. */
export async function verifyTurnstileToken(token: string, remoteIp: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => null);

  if (!response || !response.ok) return false;
  const data = await response.json();
  return data.success === true;
}
