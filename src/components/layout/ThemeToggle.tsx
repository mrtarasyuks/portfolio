"use client";

import { useTheme } from "@/context/ThemeContext";
import type { CopyDict } from "@/content/copy";

/** Same circular-pill footprint as LanguageSwitch — sits next to it in both the desktop nav row and the mobile row. */
export function ThemeToggle({ t }: { t: CopyDict }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? t.theme.switchToDark : t.theme.switchToLight}
      title={isLight ? t.theme.switchToDark : t.theme.switchToLight}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface text-text shadow-sm transition-all active:scale-90"
    >
      {isLight ? <MoonGlyph /> : <SunGlyph />}
    </button>
  );
}

function SunGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M17.99 17.99l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.77l1.77-1.77M17.99 6.01l1.77-1.77" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 14.5A8.5 8.5 0 019.5 3.5a.5.5 0 00-.7-.46A10 10 0 1021.46 15.2a.5.5 0 00-.96-.7z" />
    </svg>
  );
}
