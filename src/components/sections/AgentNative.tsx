import { Container } from "@/components/ui/Container";
import { AgentLoopDiagram } from "@/components/graphics/AgentLoopDiagram";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function AgentNative({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.agentNative.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-4xl">{t.agentNative.title}</h2>
            <p className="mt-6 max-w-md text-text-muted">{t.agentNative.body}</p>
          </div>

          <div className="min-w-0 md:col-span-7">
            <AgentLoopDiagram steps={t.agentNative.loop} />
          </div>
        </div>
      </Container>
    </section>
  );
}
