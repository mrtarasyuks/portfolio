import { Container } from "@/components/ui/Container";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { AboutVideoPanel } from "@/components/about/AboutVideoPanel";
import { ConnectBurstButton } from "@/components/hero/ConnectBurstButton";
import { getCopy } from "@/content/copy";
import { profile } from "@/content/profile";
import { locales, type Locale } from "@/content/types";
import { worldThemes, getWorldTheme } from "@/content/worldTheme";
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
        {/* Three independently-ordered grid items rather than two (text-column, video) — on
            mobile the owner wants name/role first, then the video panel, then the description,
            not "all text, then video." `order-*` reorders them visually on mobile while explicit
            column/row placement recombines name+role and body+CTA back into one left column on
            desktop, reconstructing today's exact side-by-side look there. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:grid-rows-[auto_auto] md:items-start md:gap-x-12 md:gap-y-0">
          <div className="order-1 md:col-start-1 md:row-start-1">
            <WorldTitleCube label={profile.name} color={ACCENT} />
            <p className="mt-4 font-mono text-sm uppercase tracking-wide" style={{ color: getWorldTheme("developers").signalTextVar }}>
              {t.hero.role}
            </p>
          </div>

          <AboutVideoPanel
            hasVideoDark={hasVideoDark}
            hasVideoLight={hasVideoLight}
            className="order-2 mx-auto aspect-[9/16] h-[62vh] min-h-[420px] w-auto justify-self-center md:order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:h-[80vh] md:min-h-[560px] md:-mt-16 lg:-mt-20"
          />

          <div className="order-3 md:col-start-1 md:row-start-2">
            <div className="relative max-w-xl space-y-3">
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
        </div>
      </Container>
    </div>
  );
}
