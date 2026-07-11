"use client";

import { useEffect, useState } from "react";

/** Generic mount-triggered fade+rise, staggered by `index` — used wherever a grid of blocks should appear progressively rather than all at once. */
export function StaggerFadeIn({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
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
        transform: mounted ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}
