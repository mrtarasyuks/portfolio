"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeMode } from "@/content/types";
import { setThemeCookie } from "@/lib/theme-cookie";

type ThemeValue = {
  theme: ThemeMode;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

/**
 * `initialTheme` comes from the server (cookie read in the root layout, stamped onto <html>
 * before hydration) so the first client render always agrees with the server render — no
 * flash of the wrong theme. Toggling keeps document.documentElement's data-theme attribute
 * in sync directly, since that's what globals.css's `:root[data-theme="light"]` block reads.
 */
export function ThemeProvider({ initialTheme, children }: { initialTheme: ThemeMode; children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setThemeCookie(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
