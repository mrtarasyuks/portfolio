import { Container } from "@/components/ui/Container";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { BackToWorkButton } from "@/components/work/BackToWorkButton";
import { MetaverseCanvasGate } from "@/components/scene/metaverse/MetaverseCanvasGate";
import { figurines } from "@/content/figurines";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { worldThemes } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

const ACCENT = worldThemes["3d"].signal;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/3d/metaverse");
}

export default async function MetaversePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="relative overflow-hidden pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={t.metaverse.title} accent={ACCENT} />

      <Container className="relative flex flex-col items-center pb-14 text-center md:pb-20">
        <StaggerFadeIn index={0}>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <BackToWorkButton locale={l} t={t} backHref={`/${l}/work/3d`} />
            <WorldTitleCube label={t.metaverse.title} color={ACCENT} />
          </div>
        </StaggerFadeIn>
        <p className="mt-6 max-w-lg text-text-muted">
          <TypewriterText text={t.metaverse.tagline} startDelayMs={300} speedMs={12} />
        </p>
      </Container>

      <Container className="relative">
        <StaggerFadeIn index={1} variant="scale">
          <MetaverseCanvasGate locale={l} t={t} />
        </StaggerFadeIn>

        {figurines.length === 0 && (
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-wide text-text-dim">{t.metaverse.empty}</p>
        )}
      </Container>
    </div>
  );
}
