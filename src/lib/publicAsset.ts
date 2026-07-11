import { existsSync } from "fs";
import path from "path";

/** Server-only: checks a /public-relative path exists on disk, so client components never have to request (and 404-log) a not-yet-supplied asset to find out. */
export function publicAssetExists(relativePath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", relativePath));
}
