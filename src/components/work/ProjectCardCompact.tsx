import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { LogoBadge } from "@/components/work/LogoBadge";
import { ProcessLoop } from "@/components/graphics/ProcessLoop";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

export function ProjectCardCompact({
  project,
  locale,
  t,
  hasLogo,
}: {
  project: PortfolioProject;
  locale: Locale;
  t: CopyDict;
  hasLogo?: boolean;
}) {
  const theme = getWorldTheme(project.world);
  const color = theme.signal;
  const textColor = theme.signalTextVar;

  return (
    <article className="border-t border-line py-10 md:py-20">
      <Container>
        <GlassPanel
          edgeDistortion
          className="relative p-5 md:p-10"
          style={{
            background: `linear-gradient(155deg, ${color}14, var(--glass-tint))`,
            boxShadow: `0 30px 80px -28px ${color}50, 0 16px 46px -14px rgba(0,0,0,0.55)`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-5 -right-3 select-none whitespace-nowrap font-display text-[3rem] font-bold uppercase leading-none tracking-tight md:text-[7rem]"
            style={{ color: "transparent", WebkitTextStroke: `1px ${color}2e`, textShadow: `0 0 50px ${color}1f` }}
          >
            {project.shortTitle}
          </span>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-16">
            <div className="md:w-5/12 md:shrink-0">
              <div className="mb-6 flex items-center gap-4 font-mono text-xs text-text-dim">
                <ProjectStatusBadge status={project.status} labels={t.status} />
                <span>{project.year}</span>
              </div>

              <div className="flex items-center gap-4">
                <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={color} />
                <h3 className="text-xl font-medium leading-tight tracking-tight text-text md:text-2xl">
                  {project.shortTitle}
                </h3>
              </div>

              <p className="mt-4 max-w-sm text-text-muted">{project.oneLine[locale]}</p>

              {project.stack && (
                <div className="mt-6 flex flex-wrap gap-2">
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
              )}

              <Link
                href={`/${locale}/work/${project.slug}`}
                className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: color, color: "#0c0c0e", boxShadow: `0 14px 34px -12px ${color}90` }}
              >
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {t.selectedWork.view}
              </Link>
            </div>

            <div className="relative min-w-0 max-w-sm md:flex-1">
              <ProcessLoop steps={["Idea", "Model", "Check", "Slice", "Print", "Adjust"]} label={t.metaverse.loopLabel} />
            </div>
          </div>
        </GlassPanel>
      </Container>
    </article>
  );
}
