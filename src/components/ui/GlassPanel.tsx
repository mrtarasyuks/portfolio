import { createElement, useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared "liquid glass" surface — translucent, blurred, soft specular top edge. Used identically
 * wherever glass blocks appear (homepage project panel, /work index and gallery blocks) so they
 * read as one consistent material, not several different glass effects.
 *
 * `edgeDistortion` is an opt-in extra rim layer for surfaces that need to read as thicker,
 * refractive glass (the homepage drum cards) rather than a flat tint: an SVG feTurbulence/
 * feDisplacementMap filter (id scoped via `useId()` — same duplicate-id-safety reasoning as
 * `FlagIcon`, since a panel type can render many times at once) applied only within a radial
 * rim mask, so the distortion (plus a touch of extra blur) shows at the edges only and the
 * content on top stays crisp. `backdrop-filter: url(#...)` support is inconsistent across
 * browsers — this is a progressive enhancement that silently no-ops where unsupported, not a
 * layout-affecting dependency.
 */
export function GlassPanel({
  children,
  className,
  as = "div",
  style,
  edgeDistortion = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  edgeDistortion?: boolean;
}) {
  const filterId = useId();
  return createElement(
    as,
    {
      className: cn(
        "relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-tint)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl",
        className
      ),
      style,
    },
    <>
      {edgeDistortion && (
        <>
          <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
            <filter id={filterId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={2} seed={4} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={24} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backdropFilter: `blur(4px) url(#${filterId})`,
              WebkitBackdropFilter: "blur(4px)",
              maskImage: "radial-gradient(ellipse at center, transparent 55%, black 100%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, transparent 55%, black 100%)",
            }}
          />
        </>
      )}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: "linear-gradient(to right, transparent, var(--glass-specular), transparent)" }}
      />
      {children}
    </>
  );
}
