import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { ProcessLoop } from "@/components/graphics/ProcessLoop";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

export function ProjectCardCompact({
  project,
  locale,
  t,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
}) {
  return (
    <article className="border-t border-line py-16 md:py-20">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          <div className="md:w-5/12 md:shrink-0">
            <div className="mb-6 flex items-center gap-4 font-mono text-xs text-text-dim">
              <ProjectStatusBadge status={project.status} labels={t.status} />
              <span>{project.year}</span>
            </div>

            <h3 className="text-xl font-medium leading-tight tracking-tight text-text md:text-2xl">
              {project.shortTitle}
            </h3>

            <p className="mt-4 max-w-sm text-text-muted">{project.oneLine[locale]}</p>

            {project.stack && (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-text-dim">
                {project.stack.join(" · ")}
              </p>
            )}

            <Link
              href={`/${locale}/work/${project.slug}`}
              className="group mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-text-muted transition-colors hover:text-signal"
            >
              <span aria-hidden className="inline-block h-px w-3 bg-current transition-all group-hover:w-5" />
              {t.selectedWork.view}
            </Link>
          </div>

          <div className="min-w-0 max-w-sm md:flex-1">
            <ProcessLoop steps={["Idea", "Model", "Check", "Slice", "Print", "Adjust"]} label="Physical iteration loop" />
          </div>
        </div>
      </Container>
    </article>
  );
}
