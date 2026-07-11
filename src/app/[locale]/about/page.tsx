import { Container } from "@/components/ui/Container";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
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

const TYPEWRITER_SPEED_MS = 12;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);
  const hasVideoDark = publicAssetExists(ABOUT_VIDEO_SRC_DARK);
  const hasVideoLight = publicAssetExists(ABOUT_VIDEO_SRC_LIGHT);

  // Sequential (not parallel) reveal: each paragraph's start delay picks up where the previous
  // one's typing would finish, so the whole body reads as one continuous type-through rather than
  // every paragraph animating at once. A functional reduce (not a mutated outer `let`) threads the
  // running delay, since the React Compiler's purity rule forbids reassigning a captured variable
  // during render.
  const bodyWithDelays = t.about.body.reduce<{ paragraph: string; startDelayMs: number }[]>((acc, paragraph) => {
    const previous = acc[acc.length - 1];
    const startDelayMs = previous ? previous.startDelayMs + previous.paragraph.length * TYPEWRITER_SPEED_MS : 300;
    return [...acc, { paragraph, startDelayMs }];
  }, []);

  return (
    <div className="relative overflow-hidden pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={t.about.title} accent={ACCENT} />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:items-start md:gap-12">
          <div>
            <WorldTitleCube label={profile.name} color={ACCENT} />
            <p className="mt-4 font-mono text-sm uppercase tracking-wide" style={{ color: ACCENT }}>
              {t.hero.role}
            </p>

            <div className="relative mt-8 max-w-xl space-y-3">
              {bodyWithDelays.map(({ paragraph, startDelayMs }, i) => (
                <p key={i} className="text-base leading-relaxed text-text md:text-lg">
                  <TypewriterText text={paragraph} startDelayMs={startDelayMs} speedMs={TYPEWRITER_SPEED_MS} />
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
