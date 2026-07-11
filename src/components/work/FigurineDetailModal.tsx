"use client";

import { useEffect } from "react";
import { mediaUrl } from "@/lib/media";
import type { Figurine } from "@/content/figurines";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * A fresh, lightweight modal rather than reusing `VideoLightbox` — that component is player-control
 * heavy (seek/volume/fullscreen) and video-specific; this one pairs the same looping clip with a
 * print-stats panel instead. Shares `VideoLightbox`'s backdrop/Escape-to-close/body-scroll-lock
 * chrome so both fullscreen overlays on the site behave identically.
 */
export function FigurineDetailModal({
  figurine,
  locale,
  t,
  onClose,
}: {
  figurine: Figurine;
  locale: Locale;
  t: CopyDict;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={figurine.name[locale]}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t.videoPlayer.close}
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
      >
        <CloseGlyph />
      </button>

      <div
        className="flex max-h-[90vh] max-w-[94vw] flex-col items-center gap-6 md:flex-row md:items-stretch"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={mediaUrl(figurine.loopSrc)}
          autoPlay
          muted
          loop
          playsInline
          className="max-h-[70vh] max-w-[90vw] rounded-xl bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] md:max-w-[50vw]"
        />

        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="font-display text-2xl font-bold text-white">{figurine.name[locale]}</h3>
          <dl className="mt-6 space-y-4 font-mono text-sm text-white/80">
            <Stat label={t.figurines.filament} value={`${figurine.stats.filamentGrams} g`} />
            <Stat label={t.figurines.printTime} value={`${figurine.stats.printHours} h`} />
            <Stat label={t.figurines.material} value={figurine.stats.material} />
            <Stat label={t.figurines.printer} value={figurine.stats.printer} />
          </dl>
          {figurine.note && <p className="mt-6 text-sm text-white/60">{figurine.note[locale]}</p>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-2">
      <dt className="uppercase tracking-wide text-white/50">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
