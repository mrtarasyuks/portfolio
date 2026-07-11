import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * Identical glass treatment for every project on a world gallery page — no flagship/compact size
 * distinction here, per the "all blocks identical" brief. Background is forced to a fixed dark
 * tone (via `style`, which reliably out-ranks the shared GlassPanel's own theme-reactive
 * `--glass-tint` class) rather than the usual light/dark-reactive glass — the block's own text is
 * pinned to fixed white tones to match, so both stay legible together regardless of site theme.
 */
export function GlassProjectBlock({
  project,
  locale,
  t,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
}) {
  return (
    <Link href={`/${locale}/work/${project.slug}`} className="group block h-full">
      <GlassPanel
        className="flex h-full min-h-[300px] flex-col justify-between p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-[0_0_70px_-16px_var(--signal)]"
        style={{ backgroundColor: "rgba(9,9,11,0.68)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <ProjectStatusBadge status={project.status} labels={t.status} style={{ color: "rgba(255,255,255,0.5)" }} />
            <span className="font-mono text-[10px] uppercase tracking-wide text-white/50">{project.year}</span>
          </div>
          <h3 className="text-right text-2xl font-bold leading-tight text-white sm:text-3xl">{project.shortTitle}</h3>
        </div>
        <div>
          <p className="text-sm text-white/80">{project.oneLine[locale]}</p>
          <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-white/60 transition-colors group-hover:text-signal">
            <span aria-hidden className="inline-block h-px w-3 bg-current transition-all group-hover:w-5" />
            {t.orbit.viewProject}
          </span>
        </div>
      </GlassPanel>
    </Link>
  );
}
