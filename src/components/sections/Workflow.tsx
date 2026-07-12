import { Container } from "@/components/ui/Container";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function Workflow({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const stages = t.workflow.stages;

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.workflow.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-text md:text-5xl">{t.workflow.title}</h2>
            <p className="mt-6 max-w-md text-text-muted">{t.workflow.intro}</p>
          </div>

          <div className="md:col-span-7">
            <ol className="flex flex-col gap-6 md:gap-8">
              {stages.map((stage, i) => (
                <StaggerFadeIn key={stage.index} index={i}>
                  <li className="group flex gap-5">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-signal/50 bg-gradient-to-b from-signal/20 to-transparent font-mono text-xs font-bold text-signal-text shadow-[0_0_18px_-4px_var(--signal)]">
                        {stage.index}
                      </span>
                      {i < stages.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-gradient-to-b from-signal/50 to-line" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface p-5 pb-7 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_-18px_var(--signal)]">
                      <h3 className="text-base font-medium text-text">{stage.title}</h3>
                      <p className="mt-2 text-sm text-text-muted">{stage.body}</p>
                    </div>
                  </li>
                </StaggerFadeIn>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
