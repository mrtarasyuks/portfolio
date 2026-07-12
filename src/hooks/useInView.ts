"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the returned ref's element has scrolled near the viewport, false again once it
 * scrolls back out — used to gate autoplaying `<video>` elements (`VideoCard.tsx`) so a page with
 * many preview clips only actually loads/plays the ones currently on screen instead of all of them
 * at once. `rootMargin` defaults to a generous pre-load band so playback has already started by
 * the time a card is actually visible, not the instant it crosses the exact viewport edge.
 */
export function useInView<T extends HTMLElement>(rootMargin = "200px"): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
