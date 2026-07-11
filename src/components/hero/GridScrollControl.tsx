"use client";

import { cn } from "@/lib/cn";
import { useGridScroll } from "@/context/GridScrollContext";
import type { CopyDict } from "@/content/copy";

/**
 * A compact on/off toggle button (matching the header's other circular icon buttons) — toggling
 * it scrolls the floor grid under the avatar's platform, Tron-style, and drives each world's own
 * signature motion (Developers lamp fade, 3D equalizer vases, Video falling donuts). The speed
 * slider used to sit inline as a permanent full-width bar; it's now a small dropdown panel that
 * unrolls top-down from the button, visible only while the effect is on — the always-visible bar
 * was part of why the mobile header grew tall enough to visually overlap the avatar beneath it.
 */
export function GridScrollControl({ color, t }: { color: string; t: CopyDict }) {
  const { on, speed, toggle, setSpeed } = useGridScroll();

  return (
    <div className="relative">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t.gridScroll.toggle}
        onClick={toggle}
        className={cn(
          "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-150 active:scale-90",
          on ? "border-transparent" : "border-line-strong bg-gradient-to-b from-surface-soft to-surface"
        )}
        style={
          on
            ? { backgroundColor: color, boxShadow: `inset 0 2px 4px rgba(0,0,0,0.45), 0 0 10px ${color}99` }
            : { boxShadow: "0 2px 0 rgba(0,0,0,0.5), 0 3px 5px rgba(0,0,0,0.3)" }
        }
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: on ? "#151300" : "var(--text-dim)" }} />
      </button>

      <div
        aria-hidden={!on}
        className="pointer-events-none absolute right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out"
        style={{
          transformOrigin: "top",
          maxHeight: on ? 56 : 0,
          opacity: on ? 1 : 0,
          transform: on ? "scaleY(1)" : "scaleY(0.6)",
        }}
      >
        <div className={cn("flex items-center gap-2 px-3 py-2.5", on && "pointer-events-auto")}>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wide text-text-dim">{t.gridScroll.speed}</span>
          <input
            type="range"
            min={0.15}
            max={2}
            step={0.05}
            value={speed}
            disabled={!on}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label={t.gridScroll.speed}
            tabIndex={on ? 0 : -1}
            className="h-1 w-24 cursor-pointer accent-current disabled:cursor-not-allowed"
            style={{ color }}
          />
        </div>
      </div>
    </div>
  );
}
