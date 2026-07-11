/**
 * The gallery page's title, styled as a small volumetric glass cube — a folded right spine +
 * bottom edge (the same fake-3D "preserve-3d + folded face" trick BioCard uses) plus an inset
 * box-shadow glow reading as a light lit from inside the glass, rather than a flat text heading.
 */
export function WorldTitleCube({ label, glyph, color }: { label: string; glyph: string; color: string }) {
  return (
    <div className="relative" style={{ transformStyle: "preserve-3d", transform: "perspective(1000px) rotateY(-12deg)" }}>
      <div
        className="absolute inset-0 -z-10 blur-2xl"
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 h-full w-3.5 rounded-r-2xl"
        style={{
          background: `linear-gradient(to right, ${color}33, rgba(6,6,8,0.9))`,
          transform: "rotateY(90deg) translateX(7px)",
          transformOrigin: "left center",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 h-3.5 w-full rounded-b-2xl"
        style={{
          background: `linear-gradient(to bottom, ${color}22, rgba(6,6,8,0.9))`,
          transform: "rotateX(-90deg) translateY(7px)",
          transformOrigin: "center top",
        }}
        aria-hidden
      />
      <div
        className="relative rounded-2xl border px-8 py-5 sm:px-14 sm:py-8"
        style={{
          borderColor: `${color}55`,
          background: `linear-gradient(160deg, ${color}26, rgba(10,10,12,0.88))`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 30px 80px -20px ${color}66, inset 0 0 46px -6px ${color}55`,
          transform: "translateZ(7px)",
        }}
      >
        <span className="block font-mono text-xs uppercase tracking-wide" style={{ color }} aria-hidden>
          {glyph}
        </span>
        <h1 className="mt-1 text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">{label}</h1>
      </div>
    </div>
  );
}
