import type { Locale } from "@/content/types";

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000`;
}
