import { Container } from "@/components/ui/Container";
import { SelectedWorkList } from "@/components/work/SelectedWorkList";
import { WorldChooserBlocks } from "@/components/work/WorldChooserBlocks";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { worldThemes } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

const ACCENT = worldThemes.developers.signal;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work");
}

export default async function WorkIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="relative pb-20 md:pb-28">
      <PageTitleWatermark title={t.nav.work} accent={ACCENT} />

      <Container className="relative pt-20 md:pt-28">
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.orbit.switchWorld}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-4xl">{t.nav.work}</h1>

        <div className="mt-10">
          <WorldChooserBlocks locale={l} t={t} />
        </div>
      </Container>

      <div className="mt-20 md:mt-28">
        <SelectedWorkList locale={l} headingTag="h2" />
      </div>
    </div>
  );
}
