import { ExtraWorkGalleryShell } from "@/components/work/ExtraWorkGalleryShell";
import { AiCreatorVideoGrid } from "@/components/work/AiCreatorVideoGrid";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { extraWorkAccents } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

const ACCENT = extraWorkAccents.aiCreator;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/ai-creator");
}

export default async function AiCreatorWorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <ExtraWorkGalleryShell
      locale={l}
      t={t}
      label={t.extraWork.aiCreator.label}
      tagline={t.extraWork.aiCreator.tagline}
      glyph="✦"
      color={ACCENT}
    >
      <AiCreatorVideoGrid t={t} />
    </ExtraWorkGalleryShell>
  );
}
