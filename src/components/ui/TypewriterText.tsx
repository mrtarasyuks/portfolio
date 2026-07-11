"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reveals text character-by-character on mount. Screen readers get the full text immediately via a separate sr-only node — the animated span is aria-hidden so nothing is read twice or mid-word. */
export function TypewriterText({
  text,
  className,
  speedMs = 16,
  startDelayMs = 0,
}: {
  text: string;
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
}) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, speedMs);
    }, startDelayMs);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speedMs, startDelayMs]);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {count < text.length && <span className="opacity-50">▍</span>}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
