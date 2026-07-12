/** `bare` drops the bordered/opaque card wrapper — used when the diagram is embedded inside
 * another surface (the case study's amorphous metaverse portal block) that already supplies its
 * own background; the default (bordered) form stays for standalone usage (the homepage compact
 * project card). */
export function ProcessLoop({ steps, label, bare = false }: { steps: string[]; label: string; bare?: boolean }) {
  const angleStep = 360 / steps.length;

  return (
    <div className={bare ? "" : "border border-line bg-surface p-6 md:p-8"}>
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-wide text-text-dim">{label}</p>

      <div className="relative mx-auto aspect-square w-full max-w-[280px]">
        <div className="absolute inset-[18%] rounded-full border border-dashed border-line-strong" aria-hidden />
        {steps.map((step, i) => {
          const angle = angleStep * i - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 50;
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <div
              key={step}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={
                  "h-2 w-2 rounded-full " + (i === 0 ? "bg-signal" : "bg-line-strong")
                }
                aria-hidden
              />
              <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wide text-text-muted">
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
