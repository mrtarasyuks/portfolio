type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Fixed-window per-key counter, in memory. This is safe here specifically because the site runs
 * as a single Node process on one Coolify/Hetzner container (see CLAUDE.md's deploy section) — not
 * serverless, not multi-instance — so there's no need for a shared store like Redis just to rate
 * limit a couple of low-traffic voice endpoints. Entries for keys that never come back leak until
 * the next deploy restarts the process, which is an acceptable tradeoff at this traffic scale.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
