"use client";

import { usePathname } from "next/navigation";
import { GridScrollControl } from "@/components/hero/GridScrollControl";
import { useWorldNav } from "@/context/WorldNavContext";
import { getWorldTheme } from "@/content/worldTheme";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

/** Attaches under the world-switch pill, homepage only — same width, same gating logic as WorldSwitchHeaderNav. */
export function HeroGridScrollBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { world } = useWorldNav();

  if (pathname !== `/${locale}`) return null;

  const t = getCopy(locale);
  const theme = getWorldTheme(world);
  return <GridScrollControl color={theme.signal} t={t} />;
}
