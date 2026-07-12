import { Container } from "@/components/ui/Container";
import { toolLogosRowA, toolLogosRowB, type ToolLogo } from "@/content/toolLogos";
import type { CopyDict } from "@/content/copy";

/** How many times the source logo list is repeated before the seamless-loop duplication is
 * applied — a "one lap" base list needs to be wider than any realistic viewport on its own, or the
 * `-50%` reset (see below) leaves visible empty space for part of the loop instead of reading as
 * gapless. 4 laps of a 5-6 logo row comfortably clears ultra-wide desktop viewports. */
const REPEAT = 4;

/** Two infinite-scroll rows, opposite directions — the duplicated-list marquee idiom already used
 * elsewhere in this codebase (`.animate-slide-up`), adapted to a horizontal `translateX`. Logos
 * render via a real `<img>` (this codebase's first — every other asset so far has been a
 * decorative CSS background-image, but a logo wall needs real alt text and intrinsic sizing). */
function MarqueeRow({ logos, direction }: { logos: ToolLogo[]; direction: "left" | "right" }) {
  // The `-50%` keyframe reset only reads as seamless if the pre-duplication base list is already
  // wider than the viewport — otherwise the doubled list finishes short of the container's right
  // edge and the reset shows as a visible empty gap before repeating. Repeating the source list
  // first (not just doubling the raw short array) guarantees the base lap is always wide enough,
  // regardless of screen width or how few logos a row has.
  const base = Array.from({ length: REPEAT }, () => logos).flat();
  const doubled = [...base, ...base];
  return (
    <div
      className="overflow-hidden py-2"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className={`flex w-max items-center gap-6 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}>
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex h-16 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-7 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="h-8 w-auto object-contain opacity-90 transition-all duration-300 hover:scale-110 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolLogosMarquee({ t }: { t: CopyDict }) {
  return (
    <section className="border-t border-line py-14 md:py-20">
      <Container>
        <p className="text-center font-mono text-xs uppercase tracking-wide text-text-dim">{t.toolsMarquee.eyebrow}</p>
      </Container>
      <div className="mt-8 space-y-4">
        <MarqueeRow logos={toolLogosRowA} direction="left" />
        <MarqueeRow logos={toolLogosRowB} direction="right" />
      </div>
    </section>
  );
}
