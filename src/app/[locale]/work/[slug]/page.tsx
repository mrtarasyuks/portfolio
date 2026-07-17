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
import { MetaversePortalBlock } from "@/components/work/MetaversePortalBlock";
import { ProjectVideo } from "@/components/work/ProjectVideo";
import { ProductImageSlider } from "@/components/work/ProductImageSlider";
import { projects, getProject } from "@/content/projects";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";
import { locales, worlds } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import { publicAssetExists } from "@/lib/publicAsset";
import { buildMetadata } from "@/lib/seo";

const diagrams: Record<string, React.ComponentType> = {
  foody: FoodyFlowDiagram,
  frameforg: PipelineDiagram,
};

/** 3d-lab's own diagram doesn't go through the generic `diagrams` map above — it gets a distinct
 * treatment (moved up beside Stack, wrapped in the amorphous Metaverse portal) rather than sitting
 * in the shared Summary/Diagram/Video order every other case study uses. */
const PROCESS_LOOP_STEPS = ["Idea", "Model", "Check", "Slice", "Print", "Adjust"];

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

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
    boxShadow: `0 34px 90px -22px ${accent}55`,
  };
}

/** One distinguishing shape per card type — a clipped/notched corner, never a plain rectangle for
 * every card — same "each element gets its own shape grammar" rule this project already applies
 * to its diagrams. Modest cut depths (well inside each card's own padding) so text never runs into
 * the diagonal edge. */
const CARD_SHAPE = {
  role: { clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)" },
  challenge: { clipPath: "polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)" },
  summary: { clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)" },
} as const satisfies Record<string, React.CSSProperties>;

function Chip({ label, accent, accentText }: { label: string; accent: string; accentText: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide sm:px-3 sm:py-1.5 sm:text-[11px]"
      style={{
        borderColor: `${accent}4d`,
        background: `linear-gradient(160deg, ${accent}26, rgba(255,255,255,0.02))`,
        color: accentText,
        boxShadow: `0 0 20px -8px ${accent}80`,
      }}
    >
      {label}
    </span>
  );
}

export default async function CaseStudyPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { from } = await searchParams;
  const project = getProject(slug);
  if (!project) notFound();

  const l = locale as Locale;
  const t = getCopy(l);
  // "tools" isn't a `worlds` entry (see PortfolioProject.extraWork) but is still a real, valid
  // back-navigation target reachable via a GlassProjectBlock card on /work/tools.
  const backTargets: string[] = [...worlds, "tools"];
  const backHref = from && backTargets.includes(from) ? `/${l}/work/${from}` : undefined;
  const Diagram = diagrams[project.slug];
  const theme = getWorldTheme(project.world);
  const accent = theme.signal;
  const accentText = theme.signalTextVar;
  const hasLogo = publicAssetExists(projectLogoSrc(project.slug));
  const videoMedia = project.media?.filter((m) => m.kind === "video" && m.src) ?? [];
  const screenshotMedia = project.media?.filter((m) => m.kind === "screenshot" && m.src) ?? [];

  let stepIndex = 0;
  const next = () => stepIndex++;

  return (
    <article className="relative overflow-x-hidden pb-16 pt-10 sm:pb-24 sm:pt-14 md:pb-32 md:pt-20">
      {/* The Role/Stack/Challenge grid's slide-left/slide-right entrance variants translate ±28px
          horizontally from their resting position during the pre-hydration mount window — on a
          narrow viewport where a card's resting width is already near the full page width, that
          transient offset can briefly exceed the viewport before settling. Clipped at the source
          (this page's own root) rather than shortening the animation distance. */}
      <PageTitleWatermark title={project.shortTitle} accent={accent} />

      <Container className="relative flex flex-col items-center pb-14 text-center md:pb-20">
        <StaggerFadeIn index={next()}>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <BackToWorkButton locale={l} t={t} backHref={backHref} />
            <LogoBadge hasLogo={hasLogo} src={projectLogoSrc(project.slug)} world={project.world} color={accent} size="responsive" />
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

      <Container className="relative pt-8 sm:pt-14 md:pt-20">
        {/* Role/Stack/Challenge distribute across up to 3 columns when there's room, instead of
            Challenge always dropping to its own full-width row underneath a 2-up Role/Stack pair. */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StaggerFadeIn index={next()} variant="slide-left">
            <GlassPanel className="h-full p-5 sm:p-8 md:p-10" style={{ ...cardStyle(accent), ...CARD_SHAPE.role }}>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.selectedWork.roleLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.role.map((r) => (
                  <Chip key={r} label={r} accent={accent} accentText={accentText} />
                ))}
              </div>
            </GlassPanel>
          </StaggerFadeIn>

          {project.stack && (
            <StaggerFadeIn index={next()} variant="slide-right">
              <div className="relative h-full pt-5">
                {/* Notch-style title straddling the card's top edge — same fixed-dark-bg/white-text
                    mounting idiom VideosByCategory's category titles already use, on the outer
                    wrapper (not GlassPanel, whose own overflow-hidden would clip a notch sitting on
                    its border). */}
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a0a0c] px-6 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)]">
                  <p className="font-mono text-[11px] font-black uppercase tracking-wide text-white">{t.selectedWork.stackLabel}</p>
                </div>
                <GlassPanel className="h-full p-5 pt-9 sm:p-8 sm:pt-10 md:p-10 md:pt-12" style={cardStyle(accent)}>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <Chip key={s} label={s} accent={accent} accentText={accentText} />
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </StaggerFadeIn>
          )}

          {project.challenge && (
            <StaggerFadeIn index={next()} variant="rise">
              <GlassPanel className="h-full p-5 sm:p-8 md:p-10" style={{ ...cardStyle(accent), ...CARD_SHAPE.challenge }}>
                <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.hardPart}</p>
                <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">{project.challenge[l]}</p>
              </GlassPanel>
            </StaggerFadeIn>
          )}
        </div>

        {project.slug === "3d-lab" && (
          <StaggerFadeIn index={next()} variant="rise" className="mt-4 sm:mt-5 block">
            <MetaversePortalBlock locale={l} t={t} accent={accent} steps={PROCESS_LOOP_STEPS} label={t.metaverse.loopLabel} />
          </StaggerFadeIn>
        )}

        <StaggerFadeIn index={next()} variant="scale" className="mt-4 sm:mt-5 block">
          <GlassPanel
            edgeDistortion
            className="p-6 sm:p-8 md:p-12"
            style={{
              background: `linear-gradient(155deg, ${accent}14, var(--glass-tint))`,
              boxShadow: `0 44px 110px -28px ${accent}60, 0 20px 60px -15px rgba(0,0,0,0.6)`,
              ...CARD_SHAPE.summary,
            }}
          >
            <p className="text-base leading-relaxed text-text-muted md:text-lg">
              <TypewriterText text={project.summary[l]} startDelayMs={200} speedMs={10} />
            </p>
          </GlassPanel>
        </StaggerFadeIn>

        {Diagram && (
          <StaggerFadeIn index={next()} variant="rise" className="mt-4 sm:mt-5 block">
            <GlassPanel className="p-4 md:p-6" style={cardStyle(accent)}>
              <Diagram />
            </GlassPanel>
          </StaggerFadeIn>
        )}

        {screenshotMedia.length > 0 && (
          <StaggerFadeIn index={next()} variant="rise" className="mt-4 sm:mt-5 block">
            <ProductImageSlider
              images={screenshotMedia.map((m) => ({ src: m.src!, label: m.label }))}
              accent={accent}
              label={t.caseStudy.gallery}
            />
          </StaggerFadeIn>
        )}

        {videoMedia.map((m) => (
          <StaggerFadeIn key={m.src} index={next()} variant="slide-left" className="mt-4 sm:mt-5 block">
            <GlassPanel className="relative overflow-hidden p-5 sm:p-8 md:p-10" style={cardStyle(accent)}>
              {/* Viewfinder-bracket corner accents — a small motif of this card's own, distinct
                  from every other card's shape treatment on this page. */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-4 h-7 w-7 border-l-2 border-t-2"
                style={{ borderColor: `${accent}90` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b-2 border-r-2"
                style={{ borderColor: `${accent}90` }}
              />
              <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.demo}</p>
              <ProjectVideo src={m.src!} label={m.label} t={t} />
            </GlassPanel>
          </StaggerFadeIn>
        ))}

        {project.approach && (
          <StaggerFadeIn index={next()} variant="rise" className="mt-4 sm:mt-5 block">
            <GlassPanel className="p-5 sm:p-8 md:p-10" style={cardStyle(accent)}>
              <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">{t.caseStudy.approach}</p>
              <ul className="mt-4 space-y-3">
                {project.approach[l].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-text-muted"
                    style={{ marginLeft: `${Math.min(i, 3) * 16}px` }}
                  >
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                      style={{
                        background: `linear-gradient(160deg, ${accent}33, rgba(255,255,255,0.03))`,
                        color: accentText,
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
          <StaggerFadeIn index={next()} className="mt-4 sm:mt-5 block">
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
