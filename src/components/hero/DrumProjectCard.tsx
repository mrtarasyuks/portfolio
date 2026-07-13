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

/** Elongated corner radius (horizontal/vertical) rather than a uniform `rounded-*` class — the
 * drum spins around its X axis (a vertical reel), so exaggerating the top/bottom curve over the
 * side curve is what actually reads as "this card is a curved slat on a barrel," not just a
 * rounded rectangle. Set via inline style since it must win over GlassPanel's own `rounded-2xl`
 * class, and this codebase's plain `cn()` doesn't dedupe/override classes by source order. */
const BARREL_RADIUS = "26px / 54px";

/** Cylindrical shading overlay — darkens toward the top/bottom edges the way light falls off a
 * curved surface, reinforcing the barrel read without any extra geometry. Purely decorative. */
function BarrelShading() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 22%, transparent 78%, rgba(0,0,0,0.4))" }}
    />
  );
}

/** Bigger, voluminous upgrade of the old flat OrbitProjectCard — used on the homepage drum
 * carousel. Same BioCard-style folded-spine trick (a face turned 90° via preserve-3d) so the card
 * reads as a real thick object as the drum rotates, not a flat plane. The whole card is now the
 * single clickable element (`onSelect`, not an inner `<Link>`) — clicking it freezes the drum and
 * selects it (`ProjectSliderPanel` owns that state); `isSelected` here just drives the visual
 * response — an accent-colored outline glow plus a small extra `translateZ` pop toward the
 * viewer — rather than the old fly-to-viewport-center/blackout transition that used to live here. */
export function DrumProjectCard({
  project,
  locale,
  t,
  isSelected = false,
  onSelect,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
  isSelected?: boolean;
  onSelect: () => void;
}) {
  const accent = getWorldTheme(project.world).signal;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${t.orbit.viewProject}: ${project.shortTitle}`}
      aria-pressed={isSelected}
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
        className="relative flex min-h-[240px] flex-col p-5 transition-transform duration-300 sm:min-h-[270px] sm:p-6"
        style={{
          transform: `translateZ(${isSelected ? 32 : 4}px) scale(${isSelected ? 1.05 : 1})`,
          backgroundColor: "var(--glass-tint-strong)",
          borderRadius: BARREL_RADIUS,
          borderColor: isSelected ? accent : undefined,
          boxShadow: isSelected
            ? `0 20px 60px -15px rgba(0,0,0,0.6), 0 0 0 2px ${accent}, 0 0 44px 6px ${accent}66`
            : undefined,
        }}
      >
        <BarrelShading />
        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-text-dim">
          <span>{worldBarLabel[project.world]}</span>
          <span>{project.year}</span>
        </div>
        <ProjectStatusBadge status={project.status} labels={t.status} className="relative mt-3" />
        <h3 className="relative mt-2 text-lg font-medium leading-snug text-text">{project.shortTitle}</h3>
        <p className="relative mt-2 line-clamp-2 flex-1 text-sm text-text-muted">{project.oneLine[locale]}</p>
        <span
          className="relative mt-4 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide transition-transform group-hover:scale-105"
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
      className="pointer-events-auto relative flex min-h-[240px] w-[250px] flex-col items-center justify-center gap-2 border-dashed px-4 py-8 text-center select-none sm:min-h-[270px] sm:w-[290px]"
      style={{ backgroundColor: "var(--glass-tint-strong)", borderRadius: BARREL_RADIUS }}
    >
      <BarrelShading />
      <span className="relative font-mono text-[10px] uppercase tracking-wide text-text-dim">{worldBarLabel[world]}</span>
      <p className="relative font-mono text-xs uppercase tracking-wide text-text-dim">{label}</p>
    </GlassPanel>
  );
}
