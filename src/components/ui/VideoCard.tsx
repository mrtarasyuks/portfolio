"use client";

import { useEffect, useRef } from "react";
import { mediaUrl } from "@/lib/media";
import { useInView } from "@/hooks/useInView";

/**
 * A uniform-aspect thumbnail card, regardless of the source clip's own orientation (this gallery
 * mixes horizontal, vertical, and square footage) — `object-cover` crops every clip to the same
 * fixed box so the grid reads as one consistent system. The full, uncropped video still plays at
 * its native aspect ratio in the fullscreen lightbox this opens (`object-fit: contain`-equivalent
 * via max-height/max-width there), so nothing is actually lost, only the thumbnail crops.
 *
 * `onOpen` is optional: when provided, the card is a real `<button>` that opens the fullscreen
 * lightbox. When absent (the Video Creator overview's autoplaying category previews), it renders
 * as a plain non-interactive `<div>` instead — required once a whole category block becomes one
 * `<Link>` (a nested `<button>` inside a `<Link>` would be invalid/broken click semantics), and it
 * also drops the hover play-icon overlay, which would be misleading on a clip that isn't clickable.
 *
 * Autoplay cards only actually load/play once scrolled near the viewport (`useInView`), not on
 * mount — a page like `/work/video` mounts up to a dozen autoplaying cards at once, most of them
 * below the fold; loading and decoding all of them immediately was the real cause of a reported
 * "hangs when it starts" jank. Playback is driven imperatively via a ref (this codebase's
 * established pattern for continuous/dynamic media state, same idiom `VideoLightbox` already uses
 * for volume/mute) rather than the `autoPlay` attribute, since that attribute only takes effect on
 * initial mount and can't react to `inView` changing later.
 *
 * Video Creator clips (`src` under `video-creator/`) also render a `poster` — a same-name `.jpg`
 * sitting next to the clip on the media host — and default `preload` to `"none"`. Without a
 * poster, even `preload="metadata"` forces the browser to fetch a real byte range of the video
 * just to paint a first frame, and a category page like `/work/video/[category]` mounts a dozen-
 * plus of these non-autoplay cards at once. The poster removes any need to touch the video file at
 * all until playback is actually requested (either `autoPlay` scrolling into view, or the lightbox
 * opening). Case-study clips elsewhere don't have a generated poster yet, so the lookup is scoped
 * to that one folder — guessing a poster path for those would 404 (and trip the "no console
 * errors" test) rather than gracefully falling back to no poster.
 */
export function VideoCard({
  src,
  label,
  onOpen,
  autoPlay = false,
}: {
  src: string;
  label: string;
  onOpen?: () => void;
  autoPlay?: boolean;
}) {
  const [wrapRef, inView] = useInView<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldPlay = autoPlay && inView;
  const poster = src.startsWith("video-creator/") ? mediaUrl(src.replace(/\.(mp4|mov)$/i, ".jpg")) : undefined;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !autoPlay) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [autoPlay, inView]);

  const video = (
    <video
      ref={videoRef}
      src={mediaUrl(src)}
      poster={poster}
      muted
      playsInline
      loop={autoPlay}
      preload={shouldPlay ? "auto" : "none"}
      tabIndex={-1}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      aria-hidden
    />
  );

  const caption = (
    <p className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white">
      {label}
    </p>
  );

  if (!onOpen) {
    return (
      <div
        ref={wrapRef as React.RefObject<HTMLDivElement | null>}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line-strong bg-black shadow-sm"
      >
        {video}
        {caption}
      </div>
    );
  }

  return (
    <button
      ref={wrapRef as React.RefObject<HTMLButtonElement | null>}
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl border border-line-strong bg-black text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      {video}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:bg-black/25 group-hover:opacity-100">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15l14-7.5-14-7.5z" />
          </svg>
        </span>
      </div>

      {caption}
    </button>
  );
}
