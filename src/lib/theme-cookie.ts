import type { ThemeMode } from "@/content/types";

export function setThemeCookie(theme: ThemeMode) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}
