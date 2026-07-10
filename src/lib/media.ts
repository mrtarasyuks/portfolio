const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

/**
 * Resolves a relative media path (e.g. "3d-lab/print-loop.mp4") against the
 * configured media host. Returns an empty string if no host is configured yet
 * and no path was given, so callers can conditionally render.
 */
export function mediaUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const base = MEDIA_BASE_URL.replace(/\/$/, "");
  const rel = path.replace(/^\//, "");
  return base ? `${base}/${rel}` : `/${rel}`;
}
