"use client";

import { useId } from "react";
import type { Locale } from "@/content/types";

/**
 * Inline SVG flags — flag emoji (🇬🇧/🇺🇦) render as literal "GB"/"UA" text on Windows, since
 * Windows historically ships no color-emoji font that resolves regional-indicator sequences to
 * flag glyphs. Real, reliable flags need actual vector art, not a font-dependent emoji sequence.
 * Clip-path ids are per-instance (useId) since SiteHeader renders this component twice at once
 * (desktop row + mobile row, one hidden via CSS) — duplicate DOM ids would break the clip in
 * whichever copy loses the id collision.
 */
export function FlagIcon({ locale, className }: { locale: Locale; className?: string }) {
  const id = useId();
  return locale === "uk" ? <UkraineFlag clipId={id} className={className} /> : <UnitedKingdomFlag clipId={id} className={className} />;
}

function UnitedKingdomFlag({ clipId, className }: { clipId: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <clipPath id={clipId}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="24" height="24" fill="#00247d" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.4" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#cf142b" strokeWidth="1.6" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7.2" />
        <path d="M12 0V24M0 12H24" stroke="#cf142b" strokeWidth="2.6" />
      </g>
    </svg>
  );
}

function UkraineFlag({ clipId, className }: { clipId: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <clipPath id={clipId}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="24" height="12" fill="#0057b7" />
        <rect y="12" width="24" height="12" fill="#ffd700" />
      </g>
    </svg>
  );
}
