"use client";

import { useEffect } from "react";

/**
 * Fullscreen static-image viewer — same escape/backdrop-close/body-scroll-lock shell
 * `VideoLightbox` uses, minus the playback controls a still image doesn't need.
 */
export function ImageLightbox({ src, label, onClose }: { src: string; label?: string; onClose: () => void }) {
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
      aria-label={label}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex max-h-[90vh] max-w-[94vw] flex-col items-center gap-3">
        {label && <p className="font-mono text-xs uppercase tracking-wide text-white/60">{label}</p>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label ?? ""}
          className="max-h-[82vh] max-w-[94vw] rounded-xl bg-black object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
