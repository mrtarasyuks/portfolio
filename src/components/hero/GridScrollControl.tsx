"use client";

import { cn } from "@/lib/cn";
import { useGridScroll } from "@/context/GridScrollContext";
import type { CopyDict } from "@/content/copy";

/** Sits to the left of the world-switch header pill — a physical "remote control" button (raised when off, pressed-in and glowing when on) plus a speed slider. Toggling scrolls the floor grid under the avatar's platform, Tron-style, and drives each world's own signature motion (Developers lamp fade, 3D equalizer vases, Video falling donuts). */
export function GridScrollControl({ color, t }: { color: string; t: CopyDict }) {
  const { on, speed, toggle, setSpeed } = useGridScroll();

  return (
    <div className="pointer-events-auto flex w-full items-center gap-2 rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-2.5 py-1.5 shadow-sm md:w-[130px]">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t.gridScroll.toggle}
        onClick={toggle}
        className={cn(
          "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-150 active:scale-90",
          on ? "border-transparent" : "border-line-strong"
        )}
        style={
          on
            ? { backgroundColor: color, boxShadow: `inset 0 2px 4px rgba(0,0,0,0.45), 0 0 10px ${color}99` }
            : { boxShadow: "0 2px 0 rgba(0,0,0,0.5), 0 3px 5px rgba(0,0,0,0.3)" }
        }
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: on ? "#151300" : "var(--text-dim)" }} />
      </button>

      <input
        type="range"
        min={0.15}
        max={2}
        step={0.05}
        value={speed}
        disabled={!on}
        onChange={(e) => setSpeed(Number(e.target.value))}
        aria-label={t.gridScroll.speed}
        className="h-1 w-full flex-1 cursor-pointer accent-current disabled:cursor-not-allowed disabled:opacity-30"
        style={{ color }}
      />
    </div>
  );
}
