export function AgentLoopDiagram({ steps }: { steps: string[] }) {
  const mid = Math.ceil(steps.length / 2);
  const topRow = steps.slice(0, mid);
  const bottomRow = steps.slice(mid).reverse();

  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <Row items={topRow} startIndex={0} />
      <div className="my-2 flex justify-end pr-6">
        <Turn />
      </div>
      <Row items={bottomRow} startIndex={topRow.length} reverse />
    </div>
  );
}

function Row({ items, startIndex, reverse }: { items: string[]; startIndex: number; reverse?: boolean }) {
  return (
    <div className={"flex flex-wrap items-center gap-2 " + (reverse ? "flex-row-reverse" : "")}>
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-2">
          <div className="flex min-w-[6.5rem] items-center gap-2 border border-line-strong px-3 py-2.5">
            <span className="font-mono text-[10px] text-text-dim">{String(startIndex + i + 1).padStart(2, "0")}</span>
            <span className="text-xs text-text">{item}</span>
          </div>
          {i < items.length - 1 && (
            <span className="text-text-dim" aria-hidden>
              {reverse ? "←" : "→"}
            </span>
          )}
        </div>
      ))}
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
