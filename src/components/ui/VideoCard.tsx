"use client";

import { mediaUrl } from "@/lib/media";

/**
 * A uniform-aspect thumbnail card, regardless of the source clip's own orientation (this gallery
 * mixes horizontal, vertical, and square footage) — `object-cover` crops every clip to the same
 * fixed box so the grid reads as one consistent system. The full, uncropped video still plays at
 * its native aspect ratio in the fullscreen lightbox this opens (`object-fit: contain`-equivalent
 * via max-height/max-width there), so nothing is actually lost, only the thumbnail crops.
 */
export function VideoCard({ src, label, onOpen }: { src: string; label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl border border-line-strong bg-black text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      <video src={mediaUrl(src)} muted playsInline preload="metadata" tabIndex={-1} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" aria-hidden />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:bg-black/25 group-hover:opacity-100">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15l14-7.5-14-7.5z" />
          </svg>
        </span>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white">
        {label}
      </p>
    </button>
  );
}
