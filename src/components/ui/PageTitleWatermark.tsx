"use client";

import { useTheme } from "@/context/ThemeContext";

/**
 * Huge, low-opacity, glowing page title centered behind the real content — a decorative "curtain"
 * reinforcing what page you're on. The real <h1>/<h2> heading already exists per page for a11y/SEO,
 * so this is aria-hidden and purely visual.
 *
 * The glow (`textShadow`) is theme-aware: the same low-alpha accent shadow that reads as a subtle
 * warm highlight against dark theme's near-black background shows up as a visible yellow wash
 * against light theme's near-white one (confirmed via screenshot on `/about`) — dropped near-zero
 * in light theme, leaving just the faint stroke outline.
 */
export function PageTitleWatermark({ title, accent }: { title: string; accent: string }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden select-none"
    >
      <span
        className="mt-[-2vw] whitespace-nowrap font-display text-[18vw] font-semibold uppercase leading-none tracking-tight md:text-[14vw]"
        style={{
          color: "transparent",
          WebkitTextStroke: `1px ${accent}${isLight ? "18" : "22"}`,
          textShadow: isLight ? "none" : `0 0 60px ${accent}14`,
          opacity: isLight ? 0.5 : 0.6,
        }}
      >
        {title}
      </span>
    </div>
  );
}
