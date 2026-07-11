/** How long each step's glow stays lit, in real time — the sequential sweep's total loop duration
 * is this times the step count, so adding/removing steps keeps the same per-step pacing. */
const STEP_DURATION_S = 0.6;

export function AgentLoopDiagram({ steps }: { steps: string[] }) {
  const mid = Math.ceil(steps.length / 2);
  const topRow = steps.slice(0, mid);
  const bottomRow = steps.slice(mid).reverse();
  const total = steps.length;

  return (
    <div className="rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface p-6 shadow-sm md:p-8">
      <Row items={topRow} startIndex={0} total={total} />
      <div className="my-3 flex justify-end pr-6">
        <Turn />
      </div>
      <Row items={bottomRow} startIndex={topRow.length} total={total} reverse />
    </div>
  );
}

function Row({ items, startIndex, total, reverse }: { items: string[]; startIndex: number; total: number; reverse?: boolean }) {
  return (
    <div className={"flex flex-wrap items-center gap-3 " + (reverse ? "flex-row-reverse" : "")}>
      {items.map((item, i) => {
        const stepIndex = startIndex + i;
        return (
          <div key={item} className="flex items-center gap-3">
            <div
              className="flex min-w-[7.5rem] items-center gap-2 rounded-xl border bg-bg px-4 py-3 transition-colors"
              style={{
                borderColor: "var(--line-strong)",
                animation: `agent-pulse ${total * STEP_DURATION_S}s ease-in-out infinite`,
                animationDelay: `${stepIndex * STEP_DURATION_S}s`,
              }}
            >
              <span className="font-mono text-[10px] text-text-dim">{String(stepIndex + 1).padStart(2, "0")}</span>
              <span className="text-xs font-medium text-text">{item}</span>
            </div>
            {i < items.length - 1 && (
              <span className="text-text-dim" aria-hidden>
                {reverse ? "←" : "→"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Turn() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-signal" aria-hidden>
      <path d="M4 4V14C4 17 6 19 9 19H20M20 19L15 14M20 19L15 23" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
