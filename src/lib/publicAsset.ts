import { PUBLIC_ASSETS } from "./publicAssetManifest.generated";

/** Checks a /public-relative path was present at build time (manifest from scripts/gen-public-manifest.mjs), so client components never have to request (and 404-log) a not-yet-supplied asset to find out. Not fs-based: Cloudflare Workers have no filesystem. */
export function publicAssetExists(relativePath: string): boolean {
  return PUBLIC_ASSETS.has(relativePath.replace(/^\//, ""));
}
