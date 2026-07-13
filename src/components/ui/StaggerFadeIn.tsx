"use client";

import { useEffect, useState } from "react";

type Variant = "rise" | "slide-left" | "slide-right" | "scale";

const HIDDEN_TRANSFORM: Record<Variant, string> = {
  rise: "translateY(16px)",
  "slide-left": "translateX(-28px)",
  "slide-right": "translateX(28px)",
  scale: "translateY(10px) scale(0.94)",
};

/** Generic mount-triggered fade+rise (or slide/scale via `variant`), staggered by `index` — used
 * wherever a grid of blocks should appear progressively rather than all at once.
 *
 * The "shown" state resolves to `transform: none`, not e.g. `translateY(0)` — CSS transitions
 * to/from `none` animate correctly (it's the identity transform), and unlike a real transform
 * value, `none` doesn't establish a new containing block for `position: fixed` descendants. A
 * lingering `translateY(0)` here broke `ImageLightbox`/`VideoLightbox` (both `fixed inset-0`)
 * whenever opened from a card nested inside this component — the "fullscreen" overlay rendered
 * relative to the transformed card instead of the viewport. */
export function StaggerFadeIn({
  children,
  index,
  className,
  variant = "rise",
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
  variant?: Variant;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={className}
      style={{
        transition: "opacity 600ms ease-out, transform 600ms ease-out",
        transitionDelay: mounted ? `${index * 90}ms` : "0ms",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : HIDDEN_TRANSFORM[variant],
      }}
    >
      {children}
    </div>
  );
}
