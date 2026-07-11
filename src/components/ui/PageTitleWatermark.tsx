/** Huge, low-opacity, glowing page title centered behind the real content — a decorative "curtain" reinforcing what page you're on. The real <h1>/<h2> heading already exists per page for a11y/SEO, so this is aria-hidden and purely visual. */
export function PageTitleWatermark({ title, accent }: { title: string; accent: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden select-none"
    >
      <span
        className="mt-[-2vw] whitespace-nowrap font-display text-[18vw] font-semibold uppercase leading-none tracking-tight md:text-[14vw]"
        style={{
          color: "transparent",
          WebkitTextStroke: `1px ${accent}22`,
          textShadow: `0 0 60px ${accent}14`,
          opacity: 0.6,
        }}
      >
        {title}
      </span>
    </div>
  );
}
