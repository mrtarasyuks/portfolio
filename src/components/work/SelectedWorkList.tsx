import { Container } from "@/components/ui/Container";
import { ProjectCardFlagship } from "@/components/work/ProjectCardFlagship";
import { ProjectCardCompact } from "@/components/work/ProjectCardCompact";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import { worldThemes } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import { publicAssetExists } from "@/lib/publicAsset";
import type { Locale } from "@/content/types";

export function SelectedWorkList({
  locale,
  headingTag = "h2",
  showIntro = true,
  accent = worldThemes.developers.signal,
}: {
  locale: Locale;
  headingTag?: "h1" | "h2";
  showIntro?: boolean;
  accent?: string;
}) {
  const t = getCopy(locale);
  const flagship = projects.filter((p) => p.tier === "flagship");
  const compact = projects.filter((p) => p.tier === "compact");

  return (
    <section id="work" className="relative">
      {showIntro && (
        <Container className="flex flex-col items-center pt-20 text-center md:pt-28">
          <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.selectedWork.eyebrow}</p>
          <div className="mt-6">
            <WorldTitleCube label={t.selectedWork.title} color={accent} headingTag={headingTag} />
          </div>
          <p className="mt-6 max-w-xl text-text-muted">
            <TypewriterText text={t.selectedWork.intro} startDelayMs={300} speedMs={12} />
          </p>
        </Container>
      )}

      {flagship.map((project, i) => (
        <ProjectCardFlagship
          key={project.slug}
          project={project}
          locale={locale}
          index={i}
          t={t}
          reverse={i % 2 === 1}
          hasLogo={publicAssetExists(projectLogoSrc(project.slug))}
        />
      ))}

      {compact.map((project) => (
        <ProjectCardCompact
          key={project.slug}
          project={project}
          locale={locale}
          t={t}
          hasLogo={publicAssetExists(projectLogoSrc(project.slug))}
        />
      ))}
    </section>
  );
}
