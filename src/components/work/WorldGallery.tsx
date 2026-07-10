import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectCardFlagship } from "@/components/work/ProjectCardFlagship";
import { ProjectCardCompact } from "@/components/work/ProjectCardCompact";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import { getWorldTheme } from "@/content/worldTheme";
import { worlds, type Locale, type ProjectWorld } from "@/content/types";

const glyphByWorld: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

export function WorldGallery({ locale, world }: { locale: Locale; world: ProjectWorld }) {
  const t = getCopy(locale);
  const theme = getWorldTheme(world);
  const worldProjects = projects.filter((p) => p.world === world);
  const otherWorlds = worlds.filter((w) => w !== world);

  const vars = {
    "--w-bg": theme.bg,
    "--w-surface": theme.surface,
    "--w-signal": theme.signal,
    "--w-text-dim": theme.textDim,
  } as React.CSSProperties;

  return (
    <div className="world-scope" style={vars}>
      <Container className="pb-20 pt-14 md:pb-28 md:pt-20">
        <p className="world-role font-mono text-xs uppercase tracking-wide">
          {glyphByWorld[world]} {t.orbit.worlds[world]}
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-5xl">{t.orbit.worlds[world]}</h1>
        <p className="mt-4 max-w-lg text-text-muted">{t.orbit.worldTagline[world]}</p>

        <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wide">
          <Link
            href={`/${locale}/work`}
            className="border border-line-strong px-3 py-1.5 text-text-muted transition-colors hover:border-text-muted hover:text-text"
          >
            {t.selectedWork.title}
          </Link>
          {otherWorlds.map((w) => (
            <Link
              key={w}
              href={`/${locale}/work/${w}`}
              className="world-tab border border-line-strong px-3 py-1.5 text-text-muted transition-colors hover:border-text-muted hover:text-text"
            >
              {t.orbit.worlds[w]}
            </Link>
          ))}
        </div>
      </Container>

      <div className="border-t border-line">
        {worldProjects.length > 0 ? (
          worldProjects.map((project, i) =>
            project.tier === "compact" ? (
              <ProjectCardCompact key={project.slug} project={project} locale={locale} t={t} />
            ) : (
              <ProjectCardFlagship key={project.slug} project={project} locale={locale} index={i} t={t} reverse={i % 2 === 1} />
            )
          )
        ) : (
          <Container className="py-20 text-center">
            <p className="font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
          </Container>
        )}
      </div>
    </div>
  );
}
