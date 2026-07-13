"use client";

import { useState } from "react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

/** Base lap repeated before the seamless `-50%` loop duplication — same reasoning as
 * `ToolLogosMarquee`'s `REPEAT`: a case study might only supply 3-4 screenshots, and without
 * repeating the source list first, a short base lap finishes short of the container's right edge
 * and the loop reset shows as a visible gap instead of reading as gapless. */
const REPEAT = 4;

export type ProductImage = { src: string; label: string };

/**
 * Continuous right-to-left flowing strip of product screenshots/logos — same duplicated-list CSS
 * marquee idiom `ToolLogosMarquee` already established (`.animate-marquee-left`), just with
 * clickable image blocks instead of decorative logos. Each block opens the full image in
 * `ImageLightbox` on click; clicking any of the repeated copies of the same image opens the same
 * lightbox, which is expected for a short, looping source list.
 */
export function ProductImageSlider({ images, accent, label }: { images: ProductImage[]; accent: string; label: string }) {
  const [open, setOpen] = useState<ProductImage | null>(null);
  if (images.length === 0) return null;

  const base = Array.from({ length: REPEAT }, () => images).flat();
  const doubled = [...base, ...base];

  return (
    <div className="relative pt-5">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a0a0c] px-6 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)]">
        <p className="font-mono text-[11px] font-black uppercase tracking-wide text-white">{label}</p>
      </div>

      <div
        className="overflow-hidden rounded-2xl border border-line-strong py-6"
        style={{ background: `linear-gradient(160deg, ${accent}14, var(--glass-tint))`, boxShadow: `0 34px 90px -22px ${accent}55` }}
      >
        <div
          className="overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
        >
          <div className="flex w-max items-center gap-4 animate-marquee-left">
            {doubled.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => setOpen(img)}
                aria-label={img.label}
                className="group relative h-36 w-56 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-line-strong bg-black shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <p className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white">
                  {img.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && <ImageLightbox src={open.src} label={open.label} onClose={() => setOpen(null)} />}
    </div>
  );
}
