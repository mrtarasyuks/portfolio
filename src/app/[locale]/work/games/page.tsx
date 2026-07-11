import { ExtraWorkGalleryShell } from "@/components/work/ExtraWorkGalleryShell";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { extraWorkAccents } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

const ACCENT = extraWorkAccents.games;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/games");
}

export default async function GamesWorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <ExtraWorkGalleryShell locale={l} t={t} label={t.extraWork.games.label} tagline={t.extraWork.games.tagline} glyph="▣" color={ACCENT}>
      <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
    </ExtraWorkGalleryShell>
  );
}
