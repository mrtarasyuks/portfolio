import { Container } from "@/components/ui/Container";
import { SelectedWorkList } from "@/components/work/SelectedWorkList";
import { WorldChooserBlocks } from "@/components/work/WorldChooserBlocks";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
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
        <div className="flex flex-col items-center text-center">
          <WorldTitleCube label={t.nav.work} color={ACCENT} />
        </div>

        <div className="mt-12">
          <WorldChooserBlocks locale={l} t={t} />
        </div>
      </Container>

      <div className="mt-12 md:mt-16">
        <SelectedWorkList locale={l} headingTag="h2" accent={ACCENT} />
      </div>
    </div>
  );
}
