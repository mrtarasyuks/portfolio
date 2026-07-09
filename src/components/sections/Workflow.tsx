import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function Workflow({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.workflow.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-4xl">{t.workflow.title}</h2>
            <p className="mt-6 max-w-md text-text-muted">{t.workflow.intro}</p>
          </div>

          <div className="md:col-span-7">
            <ol className="flex flex-col">
              {t.workflow.stages.map((stage) => (
                <li key={stage.index} className="flex gap-6 border-t border-line py-6 first:border-t-0">
                  <span className="font-mono text-sm text-signal">{stage.index}</span>
                  <div>
                    <h3 className="text-base font-medium text-text">{stage.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-text-muted">{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
