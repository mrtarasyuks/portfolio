"use client";

import Link from "next/link";
import { useWorldNav } from "@/context/WorldNavContext";
import { getWorldTheme } from "@/content/worldTheme";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/types";

/**
 * Header's home-link pill — a client island (like `WorldSwitchHeaderNav`/`ThemeToggle` beside it)
 * since it needs the live selected-world color from `WorldNavContext`, which is mounted globally
 * in the root layout so this glow reads correctly on every route, not just the homepage where the
 * world switcher itself is interactive.
 *
 * Two renders gated by breakpoint (same dual-render-by-breakpoint pattern `FlagIcon`/the grid-scroll
 * toggle already use): the full text pill from `md:` up, and a compact round home-glyph button below
 * it — matching `SiteHeader.tsx`'s own mobile/desktop split at `md:`, since anything else would show
 * the wide text pill while the rest of the header is still in single-row mobile layout mode. The
 * text pill's own width was eating into the single-row mobile header's tight budget, and a round
 * icon button reads as clearly "home" without needing the handle text.
 */
export function HeaderLogoButton({ locale }: { locale: Locale }) {
  const { world } = useWorldNav();
  const color = getWorldTheme(world).signal;
  const style = {
    borderColor: `${color}55`,
    background: `linear-gradient(to bottom, var(--surface-soft), var(--surface))`,
    boxShadow: `0 0 34px -10px ${color}90`,
  };

  return (
    <>
      <Link
        href={`/${locale}`}
        aria-label={profile.handle}
        className="hidden cursor-pointer rounded-full border px-8 py-3 font-mono text-lg normal-case tracking-wide text-text shadow-sm transition-all active:scale-95 md:inline-flex"
        style={style}
      >
        {profile.handle.replace(/^@/, "")}
      </Link>
      <Link
        href={`/${locale}`}
        aria-label={profile.handle}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border text-text shadow-sm transition-all active:scale-95 md:hidden"
        style={style}
      >
        <HomeGlyph />
      </Link>
    </>
  );
}

function HomeGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 9.5L10 3.5L17 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8.5V16H15V8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
