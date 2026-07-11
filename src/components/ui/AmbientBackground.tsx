const BLOBS = [
  { size: 190, top: "6%", left: "3%", accent: true, duration: 23, delay: 0 },
  { size: 130, top: "58%", left: "88%", accent: false, duration: 18, delay: 2 },
  { size: 95, top: "78%", left: "12%", accent: true, duration: 27, delay: 4 },
  { size: 150, top: "16%", left: "82%", accent: false, duration: 21, delay: 1 },
  { size: 75, top: "42%", left: "48%", accent: true, duration: 25, delay: 6 },
];

const DOTS = [
  { top: "12%", left: "22%", duration: 14, delay: 0 },
  { top: "34%", left: "68%", duration: 17, delay: 3 },
  { top: "64%", left: "8%", duration: 19, delay: 1 },
  { top: "82%", left: "54%", duration: 15, delay: 5 },
  { top: "24%", left: "90%", duration: 20, delay: 2 },
  { top: "70%", left: "36%", duration: 16, delay: 4 },
];

const WAVES = [
  { top: "26%", duration: 34, delay: 0, opacity: 0.05 },
  { top: "74%", duration: 40, delay: 6, opacity: 0.035 },
];

/**
 * Sitewide, purely decorative background layer — slow blurred blobs, faint drifting dots, and
 * two thin animated wave strokes. Mounted once in the root layout (fixed, behind everything) so
 * every page gets it automatically instead of per-page wiring, generalized from the About page's
 * old bespoke FloatingBackgroundShapes (now superseded). Uses var(--signal) directly rather than
 * an accent prop since that token is fixed-purpose across both themes and every world — no
 * per-page threading needed. Reuses the existing .animate-drift keyframe (globals.css), which
 * already respects prefers-reduced-motion globally, plus one new .animate-wave-drift keyframe.
 */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {BLOBS.map((s, i) => (
        <div
          key={`blob-${i}`}
          className="animate-drift absolute rounded-full blur-2xl"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            backgroundColor: s.accent ? "var(--signal)" : "var(--text)",
            opacity: s.accent ? 0.09 : 0.035,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {DOTS.map((d, i) => (
        <span
          key={`dot-${i}`}
          className="animate-drift absolute h-1 w-1 rounded-full"
          style={{
            top: d.top,
            left: d.left,
            backgroundColor: "var(--signal)",
            opacity: 0.35,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      {WAVES.map((w, i) => (
        <svg
          key={`wave-${i}`}
          className="animate-wave-drift absolute left-[-10%] w-[120%]"
          style={{ top: w.top, opacity: w.opacity, animationDuration: `${w.duration}s`, animationDelay: `${w.delay}s` }}
          viewBox="0 0 1200 60"
          height="60"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 150 0 300 30 T 600 30 T 900 30 T 1200 30"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}
