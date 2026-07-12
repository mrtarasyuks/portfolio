"use client";

import { usePathname } from "next/navigation";
import { useWorldNav } from "@/context/WorldNavContext";
import { worlds, type Locale } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import { getCopy } from "@/content/copy";
import { cn } from "@/lib/cn";

export function WorldSwitchHeaderNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { world, setWorld, next, prev } = useWorldNav();
  const t = getCopy(locale);
  const theme = getWorldTheme(world);

  if (pathname !== `/${locale}`) return null;

  const activeIndex = worlds.indexOf(world);
  const accentVars = {
    "--w-signal": theme.signal,
    "--w-text-dim": theme.textDim,
  } as React.CSSProperties;

  return (
    <nav
      role="tablist"
      aria-label={t.orbit.switchWorld}
      style={accentVars}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface p-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.65)]"
    >
      <HeaderArrow direction="prev" label={t.orbit.prevLabel} onClick={prev} />

      {/* Text label hidden below `md:` — on mobile this nav now shares one compact header row
          with the home button and grid-scroll toggle (see SiteHeader.tsx), no room for it there;
          the world's own signal color plus the arrows are enough to navigate. Still shown from
          `md:` to `lg:` (a standalone centered row with room to spare) before the full tab row
          takes over at `lg:`. */}
      <span className="world-role hidden whitespace-nowrap px-1.5 font-mono text-sm font-bold uppercase tracking-wide md:inline-flex lg:hidden">
        {t.orbit.worlds[world]}{" "}
        <span className="text-text-dim">
          {activeIndex + 1}/{worlds.length}
        </span>
      </span>

      <div className="hidden items-center gap-1 lg:flex">
        {worlds.map((w) => (
          <button
            key={w}
            type="button"
            role="tab"
            aria-selected={w === world}
            onClick={() => setWorld(w)}
            className={cn(
              "world-tab cursor-pointer rounded-full border px-2.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wide shadow-sm transition-transform active:scale-95",
              w === world
                ? "bg-gradient-to-b from-[var(--glass-tint)] to-transparent"
                : "border-line-strong bg-transparent text-text-muted hover:border-text-muted hover:text-text"
            )}
          >
            {t.orbit.worlds[w]}
          </button>
        ))}
      </div>

      <HeaderArrow direction="next" label={t.orbit.nextLabel} onClick={next} />
    </nav>
  );
}

function HeaderArrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="world-nav-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-gradient-to-b from-[var(--glass-tint)] to-transparent text-text shadow-sm transition-transform active:scale-90"
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
        {direction === "prev" ? (
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" />
        ) : (
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
    </button>
  );
}
