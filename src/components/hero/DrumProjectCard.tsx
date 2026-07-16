import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { LogoBadge } from "@/components/work/LogoBadge";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
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
  hasLogo = false,
  onSelect,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
  isSelected?: boolean;
  hasLogo?: boolean;
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
          background: `linear-gradient(155deg, ${accent}2e, rgba(9,9,11,0.88))`,
          borderRadius: BARREL_RADIUS,
          borderColor: isSelected ? accent : `${accent}55`,
          boxShadow: isSelected
            ? `0 20px 60px -15px rgba(0,0,0,0.6), 0 0 0 2px ${accent}, 0 0 44px 6px ${accent}66`
            : `0 20px 50px -18px ${accent}80`,
        }}
      >
        <BarrelShading />
        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-white/60">
          <span>{worldBarLabel[project.world]}</span>
          <span>{project.year}</span>
        </div>
        <div className="relative mt-3 flex items-center gap-3">
          <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={accent} />
          <div className="min-w-0">
            <ProjectStatusBadge status={project.status} labels={t.status} />
            <h3 className="mt-1.5 text-xl font-black leading-snug text-white">{project.shortTitle}</h3>
          </div>
        </div>
        <p className="relative mt-3 line-clamp-2 flex-1 text-sm text-white/85">{project.oneLine[locale]}</p>
      </GlassPanel>
    </button>
  );
}

/**
 * Ghost slot on the drum for work that isn't public yet — an amorphous blurred wash (the same
 * `animate-portal-blob-*` iridescent-blob motif `MetaversePortalBlock` already uses for its
 * Metaverse portal), drifting over the card as if it's covering something behind it, with a plain
 * "SOON" stamp on top.
 */
export function DrumComingSoonCard({ label, world, accent }: { label: string; world: ProjectWorld; accent: string }) {
  return (
    <GlassPanel
      edgeDistortion
      className="pointer-events-auto relative flex min-h-[240px] w-[250px] flex-col items-center justify-center gap-2 overflow-hidden px-4 py-8 text-center select-none sm:min-h-[270px] sm:w-[290px]"
      style={{ backgroundColor: "#0c0c0e", borderRadius: BARREL_RADIUS }}
    >
      <BarrelShading />
      <div aria-hidden className="pointer-events-none absolute -inset-10">
        <span
          className="animate-portal-blob-a absolute left-[5%] top-[10%] h-[70%] w-[65%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, 0s" }}
        />
        <span
          className="animate-portal-blob-b absolute right-[0%] top-[0%] h-[55%] w-[55%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, -7s" }}
        />
        <span
          className="animate-portal-blob-c absolute bottom-[-10%] left-[15%] h-[60%] w-[65%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, -13s" }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/35" />

      <span className="relative font-mono text-[10px] uppercase tracking-wide text-white/60">{worldBarLabel[world]}</span>
      <p
        className="relative font-display text-3xl font-black uppercase leading-none tracking-wide text-white"
        style={{ textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}
      >
        Soon
      </p>
      <p className="relative font-mono text-xs uppercase tracking-wide text-white/70">{label}</p>
    </GlassPanel>
  );
}
