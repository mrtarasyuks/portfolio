const inputs = ["Photo", "Receipt", "Voice", "Text"];

const stages = [
  { label: "Mobile UX", detail: "Expo / React Native" },
  { label: "Server-side AI proxy", detail: "JWT + rate limit" },
  { label: "Model routing / fallback", detail: "Gemini → Claude" },
  { label: "Structured result", detail: "Typed AI actions" },
  { label: "Supabase data", detail: "Postgres / Storage" },
  { label: "Personalized product UI", detail: "Fridge, recipes, chat" },
];

export function FoodyFlowDiagram() {
  return (
    <div className="relative border border-line bg-surface p-6 md:p-8">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-wide text-text-dim">System flow</p>

      <div className="flex flex-wrap justify-center gap-2 pb-4">
        {inputs.map((input) => (
          <span
            key={input}
            className="rounded-sm border border-line-strong px-3 py-1 font-mono text-xs uppercase tracking-wide text-text-muted"
          >
            {input}
          </span>
        ))}
      </div>

      <div className="mx-auto h-6 w-px bg-line-strong" aria-hidden />

      <ol className="mx-auto flex max-w-md flex-col">
        {stages.map((stage, i) => (
          <li key={stage.label} className="relative flex flex-col items-center">
            <div className="flex w-full items-center gap-3 border-t border-line py-3 first:border-t-0">
              <span className="shrink-0 font-mono text-xs text-text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={
                  "min-w-0 flex-1 text-sm " + (i === stages.length - 1 ? "text-signal-text" : "text-text")
                }
              >
                {stage.label}
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] text-text-dim sm:inline">{stage.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
