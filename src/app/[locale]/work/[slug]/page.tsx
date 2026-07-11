import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
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

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const l = locale as Locale;
  const t = getCopy(l);
  const Diagram = diagrams[project.slug];
  const accent = getWorldTheme(project.world).signal;

  return (
    <article className="relative pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={project.shortTitle} accent={accent} />

      <Container className="relative">
        <Link
          href={`/${l}/work`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-text-dim transition-colors hover:text-text"
        >
          ← {t.selectedWork.title}
        </Link>

        <div className="mt-8 flex items-center gap-4 font-mono text-xs text-text-dim">
          <ProjectStatusBadge status={project.status} labels={t.status} />
          <span>{project.year}</span>
        </div>

        <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-text md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-text-muted">{project.oneLine[l]}</p>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 font-mono text-[11px] uppercase tracking-wide md:grid-cols-4">
          <div>
            <p className="mb-2 text-text-dim">Role</p>
            <ul className="space-y-1 text-text-muted">
              {project.role.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          {project.stack && (
            <div>
              <p className="mb-2 text-text-dim">Stack</p>
              <ul className="space-y-1 text-text-muted">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="mb-2 text-text-dim">Year</p>
            <p className="text-text-muted">{project.year}</p>
          </div>
          <div>
            <p className="mb-2 text-text-dim">Status</p>
            <p className="text-text-muted">{t.status[project.status]}</p>
          </div>
        </div>

        <div className="mt-14 max-w-2xl space-y-6 text-text-muted">
          <p className="text-base leading-relaxed md:text-lg">
            <TypewriterText text={project.summary[l]} startDelayMs={200} speedMs={10} />
          </p>
        </div>

        {project.challenge && (
          <div className="mt-14 max-w-2xl">
            <h2 className="font-mono text-xs uppercase tracking-wide text-text-dim">The hard part</h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">{project.challenge[l]}</p>
          </div>
        )}

        {Diagram && (
          <div className="mt-14">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-wide text-text-dim">System</h2>
            <Diagram />
          </div>
        )}

        {project.media
          ?.filter((m) => m.kind === "video" && m.src)
          .map((m) => (
            <div key={m.src} className="mt-14 max-w-2xl">
              <ProjectVideo src={m.src!} label={m.label} t={t} />
            </div>
          ))}

        {project.approach && (
          <div className="mt-14 max-w-2xl">
            <h2 className="font-mono text-xs uppercase tracking-wide text-text-dim">Approach</h2>
            <ul className="mt-4 space-y-3">
              {project.approach[l].map((item) => (
                <li key={item} className="flex gap-3 text-text-muted">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.verificationNote && (
          <div className="mt-14 max-w-2xl border-l-2 border-line-strong pl-6">
            <p className="font-mono text-xs uppercase tracking-wide text-text-dim">Verification note</p>
            <p className="mt-3 text-sm text-text-muted">{project.verificationNote[l]}</p>
          </div>
        )}
      </Container>
    </article>
  );
}
