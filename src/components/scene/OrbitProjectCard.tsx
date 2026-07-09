import Link from "next/link";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";
import { cn } from "@/lib/cn";

const worldBarLabel: Record<ProjectWorld, string> = {
  "3d": "◆ MODEL",
  video: "▷ SCREEN",
  developers: "</> APP",
};

export function OrbitProjectCard({
  project,
  locale,
  t,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
}) {
  return (
    <div className="w-[210px] select-none border border-line-strong bg-surface/90 backdrop-blur-sm sm:w-[240px]">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-text-dim">
        <span>{worldBarLabel[project.world]}</span>
        <span>{project.year}</span>
      </div>

      <div className="p-4">
        <ProjectStatusBadge status={project.status} labels={t.status} />
        <h3 className="mt-2 text-sm font-medium leading-snug text-text">{project.shortTitle}</h3>
        <p className="mt-2 line-clamp-2 text-xs text-text-muted">{project.oneLine[locale]}</p>

        <Link
          href={`/${locale}/work/${project.slug}`}
          className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-text-muted transition-colors hover:text-signal"
        >
          <span aria-hidden className="inline-block h-px w-2.5 bg-current transition-all group-hover:w-4" />
          {t.orbit.viewProject}
        </Link>
      </div>
    </div>
  );
}

export function OrbitComingSoonCard({ label, world }: { label: string; world: ProjectWorld }) {
  return (
    <div
      className={cn(
        "flex w-[210px] flex-col items-center justify-center gap-2 border border-dashed border-line px-4 py-8 text-center sm:w-[240px]"
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">{worldBarLabel[world]}</span>
      <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{label}</p>
    </div>
  );
}
