import { Container } from "@/components/ui/Container";
import { ProjectCardFlagship } from "@/components/work/ProjectCardFlagship";
import { ProjectCardCompact } from "@/components/work/ProjectCardCompact";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function SelectedWorkList({
  locale,
  headingTag: Heading = "h2",
  showIntro = true,
}: {
  locale: Locale;
  headingTag?: "h1" | "h2";
  showIntro?: boolean;
}) {
  const t = getCopy(locale);
  const flagship = projects.filter((p) => p.tier === "flagship");
  const compact = projects.filter((p) => p.tier === "compact");

  return (
    <section id="work" className="relative">
      {showIntro && (
        <Container className="pt-20 md:pt-28">
          <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.selectedWork.eyebrow}</p>
          <Heading className="mt-3 text-3xl font-medium tracking-tight text-text md:text-4xl">
            {t.selectedWork.title}
          </Heading>
          <p className="mt-4 max-w-xl text-text-muted">{t.selectedWork.intro}</p>
        </Container>
      )}

      {flagship.map((project, i) => (
        <ProjectCardFlagship key={project.slug} project={project} locale={locale} index={i} t={t} reverse={i % 2 === 1} />
      ))}

      {compact.map((project) => (
        <ProjectCardCompact key={project.slug} project={project} locale={locale} t={t} />
      ))}
    </section>
  );
}
