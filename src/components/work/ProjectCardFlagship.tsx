import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { LogoBadge } from "@/components/work/LogoBadge";
import { FoodyFlowDiagram } from "@/components/graphics/FoodyFlowDiagram";
import { PipelineDiagram } from "@/components/graphics/PipelineDiagram";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";
import { cn } from "@/lib/cn";

const diagrams: Record<string, React.ComponentType> = {
  foody: FoodyFlowDiagram,
  frameforg: PipelineDiagram,
};

/**
 * Each product block is now a glowing glass card tinted by the project's own world-signal color
 * (tying "yaskravyy/beautiful" to something meaningful rather than one flat accent everywhere),
 * with a large embossed corner watermark of the project name (the same technique used for the
 * `/work` chooser blocks and the bio cube's signage — one "volumetric text" motif reused sitewide).
 * The case-study link is a real solid CTA pill instead of a plain underline, a logo badge sits
 * beside the title (falls back to the world glyph until a real file lands, same deferred-asset
 * pattern as the bio cube's photos), and the stack renders as glowing chips.
 */
export function ProjectCardFlagship({
  project,
  locale,
  index,
  t,
  reverse,
  hasLogo,
}: {
  project: PortfolioProject;
  locale: Locale;
  index: number;
  t: CopyDict;
  reverse?: boolean;
  hasLogo?: boolean;
}) {
  const Diagram = diagrams[project.slug];
  const theme = getWorldTheme(project.world);
  const color = theme.signal;
  const textColor = theme.signalTextVar;

  return (
    <article className="border-t border-line py-10 md:py-24">
      <Container>
        <GlassPanel
          edgeDistortion
          className="relative p-5 md:p-12"
          style={{
            background: `linear-gradient(155deg, ${color}14, var(--glass-tint))`,
            boxShadow: `0 40px 100px -30px ${color}55, 0 20px 60px -15px rgba(0,0,0,0.6)`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-4 select-none whitespace-nowrap font-display text-[3.5rem] font-bold uppercase leading-none tracking-tight md:text-[9rem]"
            style={{ color: "transparent", WebkitTextStroke: `1px ${color}2e`, textShadow: `0 0 50px ${color}1f` }}
          >
            {project.shortTitle}
          </span>

          <div className={cn("relative flex flex-col gap-6 md:gap-16", reverse ? "md:flex-row-reverse" : "md:flex-row")}>
            <div className="md:w-5/12 md:shrink-0">
              <div className="mb-6 flex items-center gap-4 font-mono text-xs text-text-dim">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ProjectStatusBadge status={project.status} labels={t.status} />
                <span>{project.year}</span>
              </div>

              <div className="flex items-center gap-4">
                <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={color} />
                <h3 className="text-2xl font-medium leading-tight tracking-tight text-text md:text-3xl">
                  {project.shortTitle}
                </h3>
              </div>

              <p className="mt-4 max-w-md text-text-muted">{project.oneLine[locale]}</p>

              <p className="mt-8 font-mono text-[11px] uppercase tracking-wide text-text-dim">
                {t.selectedWork.roleLabel}
                <span className="ml-2 normal-case text-text-muted">{project.role.slice(0, 3).join(" · ")}</span>
              </p>

              {project.stack && (
                <div className="mt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.selectedWork.stackLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide"
                        style={{
                          borderColor: `${color}4d`,
                          background: `linear-gradient(160deg, ${color}26, rgba(255,255,255,0.02))`,
                          color: textColor,
                          boxShadow: `0 0 20px -8px ${color}80`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${locale}/work/${project.slug}`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: color, color: "#0c0c0e", boxShadow: `0 16px 40px -12px ${color}90` }}
                >
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  {t.selectedWork.openCaseStudy}
                </Link>
                {project.links?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal-text"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* The system-flow diagrams are dense, tall, and built for a wide reading column —
                on a stacked mobile layout they just make an already-long card much longer, so
                they're desktop/tablet only; the case-study page (which links from the CTA below)
                still shows them at full size. */}
            {Diagram && (
              <div className="relative hidden min-w-0 md:block md:flex-1">
                <Diagram />
              </div>
            )}
          </div>
        </GlassPanel>
      </Container>
    </article>
  );
}
