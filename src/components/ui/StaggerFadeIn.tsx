"use client";

import { useEffect, useState } from "react";

type Variant = "rise" | "slide-left" | "slide-right" | "scale";

const HIDDEN_TRANSFORM: Record<Variant, string> = {
  rise: "translateY(16px)",
  "slide-left": "translateX(-28px)",
  "slide-right": "translateX(28px)",
  scale: "translateY(10px) scale(0.94)",
};

const SHOWN_TRANSFORM: Record<Variant, string> = {
  rise: "translateY(0)",
  "slide-left": "translateX(0)",
  "slide-right": "translateX(0)",
  scale: "translateY(0) scale(1)",
};

/** Generic mount-triggered fade+rise (or slide/scale via `variant`), staggered by `index` — used wherever a grid of blocks should appear progressively rather than all at once. */
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
        transform: mounted ? SHOWN_TRANSFORM[variant] : HIDDEN_TRANSFORM[variant],
      }}
    >
      {children}
    </div>
  );
}
