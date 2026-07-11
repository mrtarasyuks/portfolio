/**
 * /public-relative paths for assets. Kept in a plain (non-"use client") module so both server pages
 * (which check existence via publicAssetExists) and the client components that render them can
 * import the same constant — importing a value from a "use client" file into server code doesn't
 * give you the live value, since Next.js's client-boundary transform replaces every export of such
 * a module with a reference object, not just its component exports.
 */
export const BIO_CARD_PORTRAIT_SRC = "/img/tarasiuk-card.png";
/** Other three faces of the homepage bio cube — plain photos, no text. Drop these in and the
 * matching face activates with zero further code changes, same pattern as BIO_CARD_PORTRAIT_SRC. */
export const BIO_CARD_PHOTO_RIGHT_SRC = "/img/cube-img-card01.png";
export const BIO_CARD_PHOTO_BACK_SRC = "/img/cube-img-card02.png";
export const BIO_CARD_PHOTO_LEFT_SRC = "/img/cube-img-card03.png";
export const ABOUT_VIDEO_SRC_DARK = "/video/intro-dark.mp4";
export const ABOUT_VIDEO_SRC_LIGHT = "/video/intro-white.mp4";

/** Per-project logo, checked server-side the same way as the bio cube's photo slots — drop a file
 * at this path and the project card's logo badge activates with zero further code changes. */
export function projectLogoSrc(slug: string): string {
  return `/img/logos/${slug}.png`;
}
