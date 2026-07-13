/** Pure display — `VoiceCallModal` owns the authoritative countdown (a single timestamp diff, so
 * the displayed time and the actual hang-up moment can never drift apart). */
export function CallTimer({ remainingSeconds }: { remainingSeconds: number }) {
  const clamped = Math.max(0, remainingSeconds);
  const mm = String(Math.floor(clamped / 60)).padStart(2, "0");
  const ss = String(clamped % 60).padStart(2, "0");
  return (
    <span className="font-mono text-sm tabular-nums text-text-dim">
      {mm}:{ss}
    </span>
  );
}
