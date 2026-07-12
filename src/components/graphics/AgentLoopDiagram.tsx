/** Five distinct idle animations (globals.css), cycled by step index so no two adjacent steps ever
 * share one — replaces a single shared hard on/off flash that read as the whole row "blinking" in
 * lockstep. Each has its own duration so the loop doesn't resettle into a visible sync either. */
const ANIMATIONS = [
  { name: "agent-glow-breathe", durationS: 2.6 },
  { name: "agent-float", durationS: 3.4 },
  { name: "agent-scale-pulse", durationS: 2.2 },
  { name: "agent-tilt", durationS: 3.0 },
  { name: "agent-hue-drift", durationS: 3.8 },
] as const;

const STEP_DELAY_S = 0.3;

export function AgentLoopDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface p-6 shadow-sm md:p-8">
      {/* One full-width line — falls back to horizontal scroll on viewports too narrow for 9
          comfortably-sized steps, rather than either wrapping to a second row or shrinking text
          past legibility. */}
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1 md:gap-3">
        {steps.map((step, i) => {
          const anim = ANIMATIONS[i % ANIMATIONS.length];
          return (
            <div key={step} className="flex shrink-0 items-center gap-2 md:flex-1 md:basis-0">
              <div
                className="flex min-w-[7.5rem] flex-1 items-center gap-2 rounded-xl border bg-bg px-4 py-3"
                style={{
                  borderColor: "var(--line-strong)",
                  animation: `${anim.name} ${anim.durationS}s ease-in-out infinite`,
                  animationDelay: `${i * STEP_DELAY_S}s`,
                }}
              >
                <span className="font-mono text-[10px] text-text-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs font-medium text-text">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="shrink-0 text-text-dim" aria-hidden>
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
