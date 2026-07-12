"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * Enlarged view of one BioCard face, opened on a genuine click (not a drag) on the currently
 * front-facing face. Shares `VideoLightbox`'s backdrop/Escape-to-close/body-scroll-lock chrome —
 * the same reuse `FigurineDetailModal` already made rather than re-deriving that chrome a third
 * time. Rendered via a portal to `document.body`: BioCard lives inside several transformed
 * ancestors (`scale(0.5)`, `perspective()/rotateY()`), and a `position: fixed` element nested
 * inside a transformed ancestor is scoped to that ancestor's box instead of the real viewport — a
 * portal is the only way to get a true fullscreen overlay out of that tree.
 */
export function BioCardDetailModal({
  title,
  description,
  photoSrc,
  hasPhoto,
  age,
  country,
  color,
  world,
  locale,
  t,
  onClose,
}: {
  title: string;
  description: string;
  photoSrc: string;
  hasPhoto: boolean;
  age: string;
  country: string;
  color: string;
  world: ProjectWorld | null;
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

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
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
        className="flex max-h-[90vh] max-w-[94vw] flex-col items-center gap-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101013] shadow-[0_60px_160px_-30px_rgba(0,0,0,0.9)] md:max-w-[880px] md:flex-row md:items-stretch"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-64 w-full shrink-0 bg-cover bg-center md:h-auto md:w-[46%]"
          style={{
            backgroundColor: "#101013",
            ...(hasPhoto ? { backgroundImage: `url(${photoSrc})` } : undefined),
          }}
        />

        <div className="flex flex-1 flex-col justify-center gap-5 p-8 md:p-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-black leading-none text-white">{age}</span>
            <span className="font-mono text-sm font-semibold uppercase tracking-wide" style={{ color }}>
              {country}
            </span>
          </div>
          <h3 className="font-display text-3xl font-black leading-tight text-white md:text-4xl">{title}</h3>
          <p className="text-base leading-relaxed text-white/80 md:text-lg">{description}</p>

          {world && (
            <Link
              href={`/${locale}/work/${world}`}
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: color, color: "#0c0c0e" }}
            >
              {t.bioCard.explore}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
