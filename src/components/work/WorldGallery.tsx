import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassProjectBlock } from "@/components/work/GlassProjectBlock";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { DevelopersFilter } from "@/components/work/DevelopersFilter";
import { ToolsUsed } from "@/components/work/ToolsUsed";
import { VideosByCategory } from "@/components/work/VideosByCategory";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import { getWorldTheme } from "@/content/worldTheme";
import { type Locale, type ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const glyphByWorld: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

/** Round glass "back to /work" button — sits beside the gallery page's glass-cube title. */
function BackButton({ locale, t }: { locale: Locale; t: CopyDict }) {
  return (
    <Link
      href={`/${locale}/work`}
      aria-label={t.orbit.back}
      title={t.orbit.back}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint)] text-text shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}

export function WorldGallery({ locale, world }: { locale: Locale; world: ProjectWorld }) {
  const t = getCopy(locale);
  const theme = getWorldTheme(world);
  const worldProjects = projects.filter((p) => p.world === world);

  const vars = {
    "--w-bg": theme.bg,
    "--w-surface": theme.surface,
    "--w-signal": theme.signal,
    "--w-text-dim": theme.textDim,
  } as React.CSSProperties;

  return (
    <div className="world-scope world-light-surface world-gallery-page relative" data-world={world} style={vars}>
      <PageTitleWatermark title={t.orbit.worlds[world]} accent={theme.signal} />

      <Container className="relative flex flex-col items-center pb-20 pt-14 text-center md:pb-28 md:pt-20">
        <StaggerFadeIn index={0}>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <BackButton locale={locale} t={t} />
            <WorldTitleCube label={t.orbit.worlds[world]} glyph={glyphByWorld[world]} color={theme.signal} />
          </div>
        </StaggerFadeIn>
        <p className="mt-8 max-w-lg text-text-muted">
          <TypewriterText text={t.orbit.worldTagline[world]} startDelayMs={300} speedMs={12} />
        </p>
      </Container>

      <Container className="border-t border-line pt-10 pb-20 md:pb-28">
        {world === "developers" ? (
          <DevelopersFilter projects={worldProjects} locale={locale} t={t} />
        ) : world === "video" ? (
          <div className="space-y-16">
            <ToolsUsed t={t} />
            <VideosByCategory t={t} />
          </div>
        ) : worldProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {worldProjects.map((project, i) => (
              <StaggerFadeIn key={project.slug} index={i}>
                <GlassProjectBlock project={project} locale={locale} t={t} />
              </StaggerFadeIn>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">
            {t.orbit.comingSoon}
          </p>
        )}
      </Container>
    </div>
  );
}
