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
 */
export function HeaderLogoButton({ locale }: { locale: Locale }) {
  const { world } = useWorldNav();
  const color = getWorldTheme(world).signal;

  return (
    <Link
      href={`/${locale}`}
      className="cursor-pointer rounded-full border px-4 py-1.5 font-mono text-sm normal-case tracking-wide text-text shadow-sm transition-all active:scale-95 sm:px-8 sm:py-3 sm:text-lg"
      style={{
        borderColor: `${color}55`,
        background: `linear-gradient(to bottom, var(--surface-soft), var(--surface))`,
        boxShadow: `0 0 34px -10px ${color}90`,
      }}
    >
      {profile.handle.replace(/^@/, "")}
    </Link>
  );
}
