const stages = ["Brief", "Storyboard", "Generation", "Remotion", "Audio", "QA", "Delivery"];

export function PipelineDiagram() {
  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-wide text-text-dim">Production pipeline</p>

      <div className="flex items-stretch gap-0 overflow-x-auto">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-stretch">
            <div className="flex min-w-[7rem] flex-col justify-between border border-line-strong px-3 py-4">
              <span className="font-mono text-[11px] text-text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className={"mt-4 text-sm " + (stage === "Remotion" ? "text-signal-text" : "text-text")}>
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className="flex w-8 items-center justify-center text-text-dim" aria-hidden>
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                  <path d="M0 5H18M18 5L13 1M18 5L13 9" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-wide text-text-dim">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
        Background worker process — long-running renders off the request path
      </div>
    </div>
  );
}
