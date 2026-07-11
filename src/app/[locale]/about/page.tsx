import { Container } from "@/components/ui/Container";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { AnimatedName } from "@/components/about/AnimatedName";
import { AboutVideoPanel } from "@/components/about/AboutVideoPanel";
import { ConnectBurstButton } from "@/components/hero/ConnectBurstButton";
import { getCopy } from "@/content/copy";
import { profile } from "@/content/profile";
import { locales, type Locale } from "@/content/types";
import { worldThemes } from "@/content/worldTheme";
import { ABOUT_VIDEO_SRC_DARK, ABOUT_VIDEO_SRC_LIGHT } from "@/content/assetPaths";
import { buildMetadata } from "@/lib/seo";
import { publicAssetExists } from "@/lib/publicAsset";

const ACCENT = worldThemes.developers.signal;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);
  const hasVideoDark = publicAssetExists(ABOUT_VIDEO_SRC_DARK);
  const hasVideoLight = publicAssetExists(ABOUT_VIDEO_SRC_LIGHT);

  return (
    <div className="relative overflow-hidden pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={t.about.title} accent={ACCENT} />

      <Container className="relative">
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.about.eyebrow}</p>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:items-start md:gap-12">
          <div>
            <AnimatedName name={profile.name} />
            <p className="mt-4 font-mono text-sm uppercase tracking-wide" style={{ color: ACCENT }}>
              {t.hero.role}
            </p>

            <div className="relative mt-8 max-w-xl space-y-3">
              {t.about.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-text md:text-lg">
                  <TypewriterText text={paragraph} startDelayMs={300} speedMs={12} />
                </p>
              ))}
            </div>

            <div className="mt-8">
              <ConnectBurstButton t={t} color={ACCENT} size="lg" />
            </div>
          </div>

          <AboutVideoPanel
            hasVideoDark={hasVideoDark}
            hasVideoLight={hasVideoLight}
            className="mx-auto aspect-[9/16] h-[62vh] min-h-[420px] w-auto justify-self-center md:h-[80vh] md:min-h-[560px] md:-mt-16 lg:-mt-24"
          />
        </div>
      </Container>
    </div>
  );
}
