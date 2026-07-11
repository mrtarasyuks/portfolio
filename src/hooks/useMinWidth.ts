"use client";

import { useSyncExternalStore } from "react";

/** For gating fixed-size WebGL/Html-anchored elements (which can't respond to Tailwind breakpoints) below a viewport width. */
export function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;

  function subscribe(onChange: () => void) {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
