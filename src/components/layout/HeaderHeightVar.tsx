"use client";

import { useLayoutEffect } from "react";

/**
 * Publishes the site header's real rendered height as --header-h on the root element
 * (ResizeObserver-driven — self-corrects across breakpoints and if header content changes),
 * so the hero canvas in a different subtree can pull itself up to exactly cancel it out —
 * no hardcoded pixel guess that can drift out of sync and leave a visible gap above the hero.
 */
export function HeaderHeightVar() {
  useLayoutEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const set = () => {
      document.documentElement.style.setProperty("--header-h", `${header.getBoundingClientRect().height}px`);
    };
    set();

    const observer = new ResizeObserver(set);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return null;
}
