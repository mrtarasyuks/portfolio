import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { FoodyFlowDiagram } from "@/components/graphics/FoodyFlowDiagram";
import { PipelineDiagram } from "@/components/graphics/PipelineDiagram";
import type { PortfolioProject } from "@/content/types";
import type { CopyDict } from "@/content/copy";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";

const diagrams: Record<string, React.ComponentType> = {
  foody: FoodyFlowDiagram,
  "ai-video-production": PipelineDiagram,
};

export function ProjectCardFlagship({
  project,
  locale,
  index,
  t,
  reverse,
}: {
  project: PortfolioProject;
  locale: Locale;
  index: number;
  t: CopyDict;
  reverse?: boolean;
}) {
  const Diagram = diagrams[project.slug];

  return (
    <article className="border-t border-line py-16 md:py-24">
      <Container>
        <div className={cn("flex flex-col gap-10 md:gap-16", reverse ? "md:flex-row-reverse" : "md:flex-row")}>
          <div className="md:w-5/12 md:shrink-0">
            <div className="mb-6 flex items-center gap-4 font-mono text-xs text-text-dim">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <ProjectStatusBadge status={project.status} labels={t.status} />
              <span>{project.year}</span>
            </div>

            <h3 className="text-2xl font-medium leading-tight tracking-tight text-text md:text-3xl">
              {project.shortTitle}
            </h3>

            <p className="mt-4 max-w-md text-text-muted">{project.oneLine[locale]}</p>

            <div className="mt-8 grid grid-cols-2 gap-6 font-mono text-[11px] uppercase tracking-wide">
              <div>
                <p className="mb-2 text-text-dim">Role</p>
                <ul className="space-y-1 text-text-muted">
                  {project.role.slice(0, 4).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              {project.stack && (
                <div>
                  <p className="mb-2 text-text-dim">Stack</p>
                  <ul className="space-y-1 text-text-muted">
                    {project.stack.slice(0, 4).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/work/${project.slug}`}
              className="group mt-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal"
            >
              <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
              {t.selectedWork.openCaseStudy}
            </Link>
          </div>

          <div className="min-w-0 md:flex-1">
            {Diagram && <Diagram />}
          </div>
        </div>
      </Container>
    </article>
  );
}
