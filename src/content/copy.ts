import { en } from "./copy.en";
import { uk } from "./copy.uk";
import type { Locale } from "./types";

export type CopyDict = typeof en;

export const dictionaries: Record<Locale, CopyDict> = { en, uk };

export function getCopy(locale: Locale): CopyDict {
  return dictionaries[locale];
}
