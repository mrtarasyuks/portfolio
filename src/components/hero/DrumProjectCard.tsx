import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const worldBarLabel: Record<ProjectWorld, string> = {
  "3d": "◆ MODEL",
  video: "▷ SCREEN",
  developers: "</> APP",
};

/** Bigger, voluminous upgrade of the old flat OrbitProjectCard — used on the homepage drum carousel. Same BioCard-style folded-spine trick (a face turned 90° via preserve-3d) so the card reads as a real thick object as the drum rotates, not a flat plane. */
export function DrumProjectCard({ project, locale, t }: { project: PortfolioProject; locale: Locale; t: CopyDict }) {
  return (
    <div className="pointer-events-auto relative w-[250px] select-none sm:w-[290px]" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="absolute right-0 top-0 h-full w-3"
        style={{
          background: "linear-gradient(to right, var(--glass-tint), rgba(0,0,0,0.75))",
          transform: "rotateY(90deg) translateX(6px)",
          transformOrigin: "left center",
        }}
      />
      <GlassPanel className="relative p-5" style={{ transform: "translateZ(4px)" }}>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-text-dim">
          <span>{worldBarLabel[project.world]}</span>
          <span>{project.year}</span>
        </div>
        <ProjectStatusBadge status={project.status} labels={t.status} className="mt-3" />
        <h3 className="mt-2 text-base font-medium leading-snug text-text">{project.shortTitle}</h3>
        <p className="mt-2 line-clamp-2 text-xs text-text-muted">{project.oneLine[locale]}</p>
        <Link
          href={`/${locale}/work/${project.slug}`}
          className="group relative mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-text-muted transition-colors hover:text-signal"
        >
          <span aria-hidden className="inline-block h-px w-2.5 bg-current transition-all group-hover:w-4" />
          {t.orbit.viewProject}
        </Link>
      </GlassPanel>
    </div>
  );
}

export function DrumComingSoonCard({ label, world }: { label: string; world: ProjectWorld }) {
  return (
    <div className="pointer-events-auto flex w-[250px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-4 py-10 text-center select-none sm:w-[290px]">
      <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">{worldBarLabel[world]}</span>
      <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{label}</p>
    </div>
  );
}
