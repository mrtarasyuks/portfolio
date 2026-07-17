import { cn } from "@/lib/cn";
import type { ProjectWorld } from "@/content/types";

const GLYPH_BY_WORLD: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

/** Tailwind's own fixed spacing scale (14 = 3.5rem = 56px, 28 = 7rem = 112px) - not arbitrary
 * values, so these stay static classes the JIT compiler can actually see, unlike a runtime
 * `w-[${size}px]` string. */
const SIZE_CLASSES = {
  sm: "h-14 w-14",
  responsive: "h-14 w-14 sm:h-28 sm:w-28",
} as const;
const GLYPH_SIZE_CLASSES = {
  sm: "text-xl",
  responsive: "text-xl sm:text-3xl",
} as const;

/**
 * Small glowing badge beside a product block's title — a real logo once one exists at
 * `projectLogoSrc(slug)` (server-existence-checked the same way as the bio cube's photo faces),
 * a lit world-glyph placeholder until then. Shared by the homepage drum cards, the Developers-page
 * project blocks, and the case-study page header.
 */
export function LogoBadge({
  hasLogo,
  src,
  world,
  color,
  size = "sm",
}: {
  hasLogo?: boolean;
  src: string;
  world: ProjectWorld;
  color: string;
  /** "sm" = fixed 56px everywhere (homepage/Developers-page cards); "responsive" = 56px on mobile,
   * 112px from `sm:` up - the case-study page header, which used to hide this badge below `sm:`
   * entirely (a fixed 112px badge overflowed a 320px viewport) and now just shrinks instead. */
  size?: "sm" | "responsive";
}) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border", SIZE_CLASSES[size])}
      style={{
        borderColor: `${color}55`,
        background: `linear-gradient(160deg, ${color}26, rgba(10,10,12,0.5))`,
        boxShadow: `0 10px 30px -10px ${color}80`,
      }}
    >
      {hasLogo ? (
        <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${src})` }} />
      ) : (
        <span className={cn("font-mono", GLYPH_SIZE_CLASSES[size])} style={{ color }} aria-hidden>
          {GLYPH_BY_WORLD[world]}
        </span>
      )}
    </div>
  );
}
