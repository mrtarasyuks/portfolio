import type { ProjectWorld } from "@/content/types";

const GLYPH_BY_WORLD: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

/**
 * Small glowing badge beside a product block's title — a real logo once one exists at
 * `projectLogoSrc(slug)` (server-existence-checked the same way as the bio cube's photo faces),
 * a lit world-glyph placeholder until then. Shared by `ProjectCardFlagship`/`ProjectCardCompact`
 * so both product-card styles show the exact same badge.
 */
export function LogoBadge({
  hasLogo,
  src,
  world,
  color,
  size = 56,
}: {
  hasLogo?: boolean;
  src: string;
  world: ProjectWorld;
  color: string;
  /** Square badge size in px - defaults to the original 56px (h-14/w-14) the homepage's product
   * cards still use; the case-study page header passes a larger value. */
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border"
      style={{
        width: size,
        height: size,
        borderColor: `${color}55`,
        background: `linear-gradient(160deg, ${color}26, rgba(10,10,12,0.5))`,
        boxShadow: `0 10px 30px -10px ${color}80`,
      }}
    >
      {hasLogo ? (
        <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${src})` }} />
      ) : (
        <span className="font-mono" style={{ color, fontSize: size * 0.36 }} aria-hidden>
          {GLYPH_BY_WORLD[world]}
        </span>
      )}
    </div>
  );
}
