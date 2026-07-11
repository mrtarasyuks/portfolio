"use client";

import { useRef } from "react";

const MAX_TILT_DEG = 9;
const BASE_TRANSFORM = "perspective(1000px) rotateY(-12deg)";
const RESET_TRANSITION = "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)";
const HOVER_TRANSITION = "transform 90ms ease-out";

/**
 * The gallery page's title, styled as a small volumetric glass cube — a folded right spine +
 * bottom edge (the same fake-3D "preserve-3d + folded face" trick BioCard uses) plus an inset
 * box-shadow glow reading as a light lit from inside the glass, rather than a flat text heading.
 *
 * Magnetic tilt-on-hover: the same pointer-relative `perspective()/rotateX()/rotateY()` idiom
 * already proven on `WorldChooserBlocks` (ref-mutated `style.transform`, no React state) — the
 * cube tilts away from the cursor's position within it while staying pinned at its own center
 * (rotation only, never a translate), then eases back to the resting `-12deg` pose on pointer
 * leave. Fully generic on `label`/`color` — no world-specific logic — so it's reused verbatim for
 * the `/work` index "Work" title, the "My work" list heading, the Capabilities section title, and
 * (rendered twice side by side) a world gallery page's glyph + name.
 */
export function WorldTitleCube({
  label,
  color,
  headingTag = "h1",
}: {
  label: string;
  color: string;
  /** Defaults to h1 (the primary per-page title, e.g. a world gallery page or /work's own title) — pass "h2" when this cube is reused for a secondary heading on a page that already has its own h1 (so a page never ends up with two), or "div" for a purely decorative instance (e.g. a glyph cube) that shouldn't be a heading at all. */
  headingTag?: "h1" | "h2" | "div";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const Heading = headingTag;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = HOVER_TRANSITION;
    el.style.transform = `perspective(1000px) rotateY(${(-12 - px * MAX_TILT_DEG).toFixed(2)}deg) rotateX(${(py * MAX_TILT_DEG).toFixed(2)}deg)`;
  }

  function handlePointerLeave() {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transition = RESET_TRANSITION;
    el.style.transform = BASE_TRANSFORM;
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative cursor-default"
      style={{ transformStyle: "preserve-3d", transform: BASE_TRANSFORM }}
    >
      <div
        className="absolute inset-0 -z-10 blur-2xl"
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 h-full w-3.5 rounded-r-2xl"
        style={{
          background: `linear-gradient(to right, ${color}33, rgba(6,6,8,0.9))`,
          transform: "rotateY(90deg) translateX(7px)",
          transformOrigin: "left center",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 h-3.5 w-full rounded-b-2xl"
        style={{
          background: `linear-gradient(to bottom, ${color}22, rgba(6,6,8,0.9))`,
          transform: "rotateX(-90deg) translateY(7px)",
          transformOrigin: "center top",
        }}
        aria-hidden
      />
      <div
        className="relative rounded-2xl border px-8 py-5 sm:px-14 sm:py-8"
        style={{
          borderColor: `${color}55`,
          background: `linear-gradient(160deg, ${color}26, rgba(10,10,12,0.88))`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 30px 80px -20px ${color}66, inset 0 0 46px -6px ${color}55`,
          transform: "translateZ(7px)",
        }}
      >
        <Heading className="text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">{label}</Heading>
      </div>
    </div>
  );
}
