import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { getWorldTheme } from "@/content/worldTheme";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const worldBarLabel: Record<ProjectWorld, string> = {
  "3d": "◆ MODEL",
  video: "▷ SCREEN",
  developers: "</> APP",
};

/** Bigger, voluminous upgrade of the old flat OrbitProjectCard — used on the homepage drum
 * carousel. Same BioCard-style folded-spine trick (a face turned 90° via preserve-3d) so the card
 * reads as a real thick object as the drum rotates, not a flat plane. The whole card is now the
 * single clickable element (`onSelect`, not an inner `<Link>`) — the parent `ProjectSliderPanel`
 * owns the click-to-fly-to-center transition, the same pattern `WorldChooserBlocks` already
 * established for the `/work` index blocks, just scoped to one drum card instead of three. */
export function DrumProjectCard({
  project,
  locale,
  t,
  onSelect,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
  onSelect: () => void;
}) {
  const accent = getWorldTheme(project.world).signal;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${t.orbit.viewProject}: ${project.shortTitle}`}
      className="group pointer-events-auto relative block w-[250px] cursor-pointer select-none text-left sm:w-[290px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute right-0 top-0 h-full w-3"
        style={{
          background: "linear-gradient(to right, var(--glass-tint), rgba(0,0,0,0.75))",
          transform: "rotateY(90deg) translateX(6px)",
          transformOrigin: "left center",
        }}
      />
      <GlassPanel
        edgeDistortion
        className="relative flex min-h-[340px] flex-col p-6 sm:min-h-[380px] sm:p-7"
        style={{ transform: "translateZ(4px)", backgroundColor: "var(--glass-tint-strong)" }}
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-text-dim">
          <span>{worldBarLabel[project.world]}</span>
          <span>{project.year}</span>
        </div>
        <ProjectStatusBadge status={project.status} labels={t.status} className="mt-4" />
        <h3 className="mt-3 text-lg font-medium leading-snug text-text">{project.shortTitle}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm text-text-muted">{project.oneLine[locale]}</p>
        <span
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide transition-transform group-hover:scale-105"
          style={{ backgroundColor: accent, color: "#0c0c0e", boxShadow: `0 16px 36px -14px ${accent}90` }}
        >
          {t.orbit.viewProject}
          <span aria-hidden>→</span>
        </span>
      </GlassPanel>
    </button>
  );
}

export function DrumComingSoonCard({ label, world }: { label: string; world: ProjectWorld }) {
  return (
    <GlassPanel
      edgeDistortion
      className="pointer-events-auto flex min-h-[340px] w-[250px] flex-col items-center justify-center gap-2 border-dashed px-4 py-10 text-center select-none sm:min-h-[380px] sm:w-[290px]"
      style={{ backgroundColor: "var(--glass-tint-strong)" }}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-text-dim">{worldBarLabel[world]}</span>
      <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{label}</p>
    </GlassPanel>
  );
}
