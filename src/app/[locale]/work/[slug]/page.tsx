import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { LogoBadge } from "@/components/work/LogoBadge";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { BackToWorkButton } from "@/components/work/BackToWorkButton";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { FoodyFlowDiagram } from "@/components/graphics/FoodyFlowDiagram";
import { PipelineDiagram } from "@/components/graphics/PipelineDiagram";
import { ProcessLoop } from "@/components/graphics/ProcessLoop";
import { ProjectVideo } from "@/components/work/ProjectVideo";
import { projects, getProject } from "@/content/projects";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";
import { locales } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import { publicAssetExists } from "@/lib/publicAsset";
import { buildMetadata } from "@/lib/seo";

const diagrams: Record<string, React.ComponentType> = {
  foody: FoodyFlowDiagram,
  frameforg: PipelineDiagram,
  "3d-lab": () => <ProcessLoop steps={["Idea", "Model", "Check", "Slice", "Print", "Adjust"]} label="Physical iteration loop" />,
};

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const meta = buildMetadata(locale as Locale, `/work/${slug}`);
  return { ...meta, title: `${project.shortTitle} — ${meta.title}` };
}

/** Light-glow glass card recipe shared by Role/Stack/Challenge/Diagram/Video/Approach — one step
 * down from the Summary card's heavier `edgeDistortion` treatment, so the page reads as a clear
 * hierarchy (Summary is the one guaranteed block on every project, so it gets the loudest frame). */
function cardStyle(accent: string): React.CSSProperties {
  return {
    background: `linear-gradient(160deg, ${accent}14, var(--glass-tint))`,
    boxShadow: `0 30px 80px -24px ${accent}40`,
  };
}

function Chip({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide"
      style={{
        borderColor: `${accent}4d`,
        background: `linear-gradient(160deg, ${accent}26, rgba(255,255,255,0.02))`,
        color: accent,
        boxShadow: `0 0 20px -8px ${accent}80`,
      }}
    >
      {label}
    </span>
  );
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const l = locale as Locale;
  const t = getCopy(l);
  const Diagram = diagrams[project.slug];
  const accent = getWorldTheme(project.world).signal;
  const hasLogo = publicAssetExists(projectLogoSrc(project.slug));
  const videoMedia = project.media?.filter((m) => m.kind === "video" && m.src) ?? [];

  let stepIndex = 0;
  const next = () => stepIndex++;

  return (
    <article className="relative pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={project.shortTitle} accent={accent} />

      <Container className="relative flex flex-col items-center pb-14 text-center md:pb-20">
        <StaggerFadeIn index={next()}>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <BackToWorkButton locale={l} t={t} />
            {/* Hidden below `sm`: the badge + its gap push this row past a 320px viewport
                (measured, not guessed — Playwright reported 334px of content in a 320px frame). */}
            <div className="hidden sm:block">
              <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={accent} />
            </div>
            <WorldTitleCube label={project.shortTitle} color={accent} />
          </div>
        </StaggerFadeIn>

        <StaggerFadeIn index={next()}>
          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-xs text-text-dim">
            <ProjectStatusBadge status={project.status} labels={t.status} />
            <span>{project.year}</span>
          </div>
        </StaggerFadeIn>

        <p className="mt-6 max-w-xl text-lg text-text-muted">
          <TypewriterText text={project.oneLine[l]} startDelayMs={300} speedMs={12} />
        </p>

        {project.links && project.links.length > 0 && (
          <StaggerFadeIn index={next()}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: accent, color: "#0c0c0e", boxShadow: `0 16px 40px -12px ${accent}90` }}
                >
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  {link.label}
                </a>
              ))}
            </div>
          </StaggerFadeIn>
        )}
      </Container>

      <div
        className="pulse-line mx-auto h-px w-full max-w-[1440px] bg-line-strong"
        style={{ "--pulse-color": accent } as React.CSSProperties}
        aria-hidden
      />

      <Container className="relative pt-14 md:pt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StaggerFadeIn index={next()}>
            <GlassPanel className="h-full p-6 md:p-8" style={cardStyle(accent)}>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.selectedWork.roleLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.role.map((r) => (
                  <Chip key={r} label={r} accent={accent} />
                ))}
              </div>
            </GlassPanel>
          </StaggerFadeIn>

          {project.stack && (
            <StaggerFadeIn index={next()}>
              <GlassPanel className="h-full p-6 md:p-8" style={cardStyle(accent)}>
                <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.selectedWork.stackLabel}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <Chip key={s} label={s} accent={accent} />
                  ))}
                </div>
              </GlassPanel>
            </StaggerFadeIn>
          )}
        </div>

        <StaggerFadeIn index={next()} className="mt-4 block">
          <GlassPanel
            edgeDistortion
            className="p-8 md:p-12"
            style={{
              background: `linear-gradient(155deg, ${accent}14, var(--glass-tint))`,
              boxShadow: `0 40px 100px -30px ${accent}55, 0 20px 60px -15px rgba(0,0,0,0.6)`,
            }}
          >
            <p className="text-base leading-relaxed text-text-muted md:text-lg">
              <TypewriterText text={project.summary[l]} startDelayMs={200} speedMs={10} />
            </p>
          </GlassPanel>
        </StaggerFadeIn>

        {project.challenge && (
          <StaggerFadeIn index={next()} className="mt-4 block">
            <GlassPanel className="p-6 md:p-8" style={cardStyle(accent)}>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.hardPart}</p>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">{project.challenge[l]}</p>
            </GlassPanel>
          </StaggerFadeIn>
        )}

        {Diagram && (
          <StaggerFadeIn index={next()} className="mt-4 block">
            <GlassPanel className="p-4 md:p-6" style={cardStyle(accent)}>
              <Diagram />
            </GlassPanel>
          </StaggerFadeIn>
        )}

        {videoMedia.map((m) => (
          <StaggerFadeIn key={m.src} index={next()} className="mt-4 block">
            <GlassPanel className="p-6 md:p-8" style={cardStyle(accent)}>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.demo}</p>
              <ProjectVideo src={m.src!} label={m.label} t={t} />
            </GlassPanel>
          </StaggerFadeIn>
        ))}

        {project.approach && (
          <StaggerFadeIn index={next()} className="mt-4 block">
            <GlassPanel className="p-6 md:p-8" style={cardStyle(accent)}>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.approach}</p>
              <ul className="mt-4 space-y-3">
                {project.approach[l].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                      style={{
                        background: `linear-gradient(160deg, ${accent}33, rgba(255,255,255,0.03))`,
                        color: accent,
                        boxShadow: `0 0 16px -4px ${accent}90`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </StaggerFadeIn>
        )}

        {project.verificationNote && (
          <StaggerFadeIn index={next()} className="mt-4 block">
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: `${accent}66`, boxShadow: `-8px 0 24px -18px ${accent}` }}
            >
              <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.caseStudy.verificationNote}</p>
              <p className="mt-3 text-sm text-text-muted">{project.verificationNote[l]}</p>
            </div>
          </StaggerFadeIn>
        )}
      </Container>
    </article>
  );
}
