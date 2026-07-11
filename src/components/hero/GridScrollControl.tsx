"use client";

import { cn } from "@/lib/cn";
import { useGridScroll } from "@/context/GridScrollContext";
import type { CopyDict } from "@/content/copy";

const PANEL_WIDTH = 150;

function PowerGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <path d="M12 3v8" />
      <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
    </svg>
  );
}

/**
 * A real on/off power button — gray when off, filled and glowing in the current world's signal
 * color when on (matches a reference screenshot the user supplied). The speed slider used to pop
 * out as an absolutely-positioned dropdown below the button — on short mobile viewports, where the
 * header sits close above the avatar, that floating panel could reach down far enough to overlap
 * it (and, being `position: absolute`, it also visually escaped over the world-switch nav's arrow
 * button next to it, since absolute positioning ignores the flex-col stacking that keeps normal-
 * flow siblings out of each other's way). It now expands in normal document flow instead — a
 * width transition on an `overflow-hidden` wrapper, the classic CSS-only accordion technique —
 * so opening it can only ever widen its own row, never float over anything else.
 */
export function GridScrollControl({ color, t }: { color: string; t: CopyDict }) {
  const { on, speed, toggle, setSpeed } = useGridScroll();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t.gridScroll.toggle}
        onClick={toggle}
        className={cn(
          "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 active:scale-90",
          on ? "border-transparent text-white" : "border-line-strong bg-gradient-to-b from-surface-soft to-surface text-text-dim"
        )}
        style={on ? { background: `linear-gradient(160deg, ${color}, ${color}bb)`, boxShadow: `0 0 22px -2px ${color}` } : undefined}
      >
        <PowerGlyph />
      </button>

      <div className="overflow-hidden transition-all duration-300 ease-out" style={{ width: on ? PANEL_WIDTH : 0, opacity: on ? 1 : 0 }}>
        <div
          className="flex items-center whitespace-nowrap rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-3 py-2.5"
          style={{ width: PANEL_WIDTH }}
        >
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
            className="h-1 w-full cursor-pointer accent-current disabled:cursor-not-allowed"
            style={{ color }}
          />
        </div>
      </div>
    </div>
  );
}
