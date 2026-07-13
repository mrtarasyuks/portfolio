import { Container } from "@/components/ui/Container";
import { GlassProjectBlock } from "@/components/work/GlassProjectBlock";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { DevelopersFilter } from "@/components/work/DevelopersFilter";
import { VideosByCategory } from "@/components/work/VideosByCategory";
import { FigurineGallery } from "@/components/work/FigurineGallery";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { BackToWorkButton } from "@/components/work/BackToWorkButton";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import { getWorldTheme } from "@/content/worldTheme";
import { type Locale, type ProjectWorld } from "@/content/types";

const glyphByWorld: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

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
    <div
      className="world-scope world-light-surface world-gallery-page relative overflow-x-hidden"
      data-world={world}
      style={vars}
    >
      <PageTitleWatermark title={t.orbit.worlds[world]} accent={theme.signal} />

      <Container className="relative flex flex-col items-center pb-20 pt-14 text-center md:pb-28 md:pt-20">
        <StaggerFadeIn index={0}>
          <div className="flex min-w-0 items-center justify-center gap-3 sm:gap-6">
            <BackToWorkButton locale={locale} t={t} />
            {/* Hidden below `sm`: a purely decorative duplicate of the glyph already shown inside
                this page's own project blocks — on narrow viewports its padding pushed longer
                world names (e.g. "AI Creator") past the screen edge (measured, not guessed). */}
            <div aria-hidden="true" className="hidden sm:block">
              <WorldTitleCube label={glyphByWorld[world]} color={theme.signal} headingTag="div" />
            </div>
            <WorldTitleCube label={t.orbit.worlds[world]} color={theme.signal} />
          </div>
        </StaggerFadeIn>
        <p className="mt-8 max-w-lg text-text-muted">
          <TypewriterText text={t.orbit.worldTagline[world]} startDelayMs={300} speedMs={12} />
        </p>
      </Container>

      <div
        className="pulse-line mx-auto h-px w-full max-w-[1440px] bg-line-strong"
        style={{ "--pulse-color": theme.signal } as React.CSSProperties}
        aria-hidden
      />

      <Container className="pt-10 pb-20 md:pb-28">
        {world === "developers" ? (
          <DevelopersFilter projects={worldProjects} locale={locale} t={t} />
        ) : world === "video" ? (
          <VideosByCategory t={t} locale={locale} color={theme.signal} />
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

        {world === "3d" && <FigurineGallery locale={locale} t={t} />}
      </Container>
    </div>
  );
}
