"use client";

import { useRef } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";

const MAX_TILT_DEG = 10;
const TILT_RESET = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";

/**
 * Same visual language as `WorldChooserBlocks`' glass block (corner watermark, glyph, tagline,
 * magnetic tilt-hover) but a plain `Link` to a static route instead of the fly-to-center transition
 * — that mechanic is tied to the 3D world-switch state (`WorldNavContext`), which these blocks
 * don't have since they aren't real `ProjectWorld` entries.
 */
export function ExtraWorkBlockLink({
  href,
  label,
  tagline,
  glyph,
  color,
}: {
  href: string;
  label: string;
  tagline: string;
  glyph: string;
  color: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = panelRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "transform 80ms ease-out";
    el.style.transform = `perspective(800px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) scale(1.03)`;
  }

  function handlePointerLeave() {
    const el = panelRef.current;
    if (!el) return;
    el.style.transition = "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = TILT_RESET;
  }

  return (
    <Link
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={label}
      className="group relative block cursor-pointer text-left"
      style={{ "--world-glow": color } as React.CSSProperties}
    >
      <div ref={panelRef} style={{ transformStyle: "preserve-3d", transform: TILT_RESET }}>
        <GlassPanel className="flex h-36 items-center gap-4 p-4 transition-shadow duration-300 group-hover:shadow-[0_0_70px_-14px_var(--world-glow)] sm:h-80 sm:flex-col sm:items-stretch sm:justify-between sm:gap-0 sm:p-8">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -right-2 hidden select-none whitespace-nowrap font-display text-8xl font-bold uppercase leading-none tracking-tight sm:block"
            style={{ color: "transparent", WebkitTextStroke: `1px ${color}33`, textShadow: `0 0 40px ${color}1f` }}
          >
            {label}
          </span>

          <span className="relative hidden font-mono text-4xl sm:block" style={{ color }} aria-hidden>
            {glyph}
          </span>

          <span
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-mono text-2xl sm:hidden"
            style={{ color, backgroundColor: `${color}1a`, boxShadow: `0 0 24px -8px ${color}` }}
            aria-hidden
          >
            {glyph}
          </span>

          <div className="relative min-w-0">
            <h2 className="world-block-title-glow text-xl font-semibold text-text transition-colors group-hover:text-[var(--world-glow)] sm:text-2xl sm:font-medium">
              {label}
            </h2>
            <p className="mt-1.5 text-sm text-text sm:mt-2">{tagline}</p>
          </div>
        </GlassPanel>
      </div>
    </Link>
  );
}
