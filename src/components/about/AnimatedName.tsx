"use client";

import { useEffect, useState } from "react";

/** Plain smooth fade+rise on mount — no mouse tracking. An earlier mouse-parallax version read as jittery rather than "levitating," so this trades that for a clean, reliable entrance. */
export function AnimatedName({ name }: { name: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1
      className="whitespace-nowrap font-display text-4xl font-semibold leading-[0.95] tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl"
      style={{
        transition: "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {name}
    </h1>
  );
}
