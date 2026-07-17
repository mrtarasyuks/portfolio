import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { LogoBadge } from "@/components/work/LogoBadge";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * Identical glass treatment for every project on a world gallery page — no flagship/compact size
 * distinction here, per the "all blocks identical" brief. Background is forced to a fixed dark
 * tone (via `style`, which reliably out-ranks the shared GlassPanel's own theme-reactive
 * `--glass-tint` class) rather than the usual light/dark-reactive glass — the block's own text is
 * pinned to fixed white tones to match, so both stay legible together regardless of site theme.
 *
 * Tinted by the project's own world-signal color and always-glowing (not hover-only) — the same
 * "bold/colorful/backlit" treatment `ProjectCardFlagship` already established for the homepage's
 * flagship list, scaled down for this component's compact grid-card shape.
 */
export function GlassProjectBlock({
  project,
  locale,
  t,
  hrefOverride,
  ctaLabelOverride,
  colorOverride,
  hasLogo = false,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
  /** Sends the card straight to a different route instead of this project's own case study — used
   * for "3D Lab", whose card should drop the visitor directly into the fullscreen platform rather
   * than a normal scrolling case-study page. */
  hrefOverride?: string;
  /** Paired with `hrefOverride` — the default CTA text ("View case study") is wrong once the card
   * no longer opens a case study. */
  ctaLabelOverride?: string;
  /** Used on the "extra" /work pages (e.g. Tools) so a card reads in that page's own accent color
   * instead of its project's `world` signal color, since `extraWork` projects still keep their
   * original `world` for case-study theming purposes. */
  colorOverride?: string;
  /** Server-existence-checked the same way as the case-study header's own badge - see LogoBadge. */
  hasLogo?: boolean;
}) {
  const color = colorOverride ?? getWorldTheme(project.world).signal;
  const liveLink = project.links?.[0];

  return (
    // `from` records the gallery page this card lives on (a world gallery, or an "extra" page like
    // Tools via `project.extraWork`) so the case-study's back button can return here instead of
    // always falling back to the generic /work index.
    <Link
      href={hrefOverride ?? `/${locale}/work/${project.slug}?from=${project.extraWork ?? project.world}`}
      className="group block h-full"
    >
      <GlassPanel
        className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(155deg, ${color}1f, rgba(9,9,11,0.82))`,
          boxShadow: `0 30px 80px -20px ${color}66, inset 0 0 40px -10px ${color}40`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 -right-2 select-none whitespace-nowrap font-display text-[4rem] font-bold uppercase leading-none tracking-tight md:text-[5.5rem]"
          style={{ color: "transparent", WebkitTextStroke: `1px ${color}33`, textShadow: `0 0 40px ${color}22` }}
        >
          {project.shortTitle}
        </span>

        <div className="relative flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} labels={t.status} style={{ color: `${color}cc` }} />
            <span className="font-mono text-[10px] uppercase tracking-wide text-white/50">{project.year}</span>
            {liveLink && (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                style={{ borderColor: `${color}55`, color }}
              >
                ↗ {liveLink.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={color} />
            <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">{project.shortTitle}</h3>
          </div>
        </div>
        <div className="relative">
          <p className="text-sm text-white/80">{project.oneLine[locale]}</p>
          <span
            className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            <span aria-hidden className="inline-block h-px w-3 bg-current transition-all group-hover:w-5" />
            {ctaLabelOverride ?? t.orbit.viewProject}
          </span>
        </div>
      </GlassPanel>
    </Link>
  );
}
