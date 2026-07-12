import { Container } from "@/components/ui/Container";
import { AgentLoopDiagram } from "@/components/graphics/AgentLoopDiagram";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function AgentNative({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        {/* Stacked, not side-by-side — the diagram needs the section's full width to lay all 9
            steps out in one line rather than fighting for room in a md:col-span-7 column. */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.agentNative.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-text md:text-5xl">{t.agentNative.title}</h2>
          <p className="mt-6 text-text-muted">{t.agentNative.body}</p>
        </div>

        <div className="mt-12 w-full min-w-0">
          <AgentLoopDiagram steps={t.agentNative.loop} />
        </div>
      </Container>
    </section>
  );
}
