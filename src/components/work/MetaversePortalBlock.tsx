import Link from "next/link";
import { ProcessLoop } from "@/components/graphics/ProcessLoop";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * A portal into the Metaverse print room — deliberately the one background in this codebase built
 * from pure soft-blurred blobs instead of lines/grids/geometry (every other diagram here gets its
 * own hard-edged shape grammar; this one is the opposite on purpose). All three blobs reuse the
 * same `accent` token via a `hue-rotate` filter instead of hardcoded extra colors, so the
 * shimmering "iridescent" read still traces back to one design-system color, just phase-shifted
 * (via staggered negative `animationDelay`) rather than three separate palette entries.
 */
export function MetaversePortalBlock({
  locale,
  t,
  accent,
  steps,
  label,
}: {
  locale: Locale;
  t: CopyDict;
  accent: string;
  steps: string[];
  label: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-10 md:p-16">
      <div aria-hidden className="pointer-events-none absolute -inset-16">
        <span
          className="animate-portal-blob-a absolute left-[8%] top-[10%] h-[65%] w-[60%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, 0s" }}
        />
        <span
          className="animate-portal-blob-b absolute right-[5%] top-[0%] h-[55%] w-[55%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, -7s" }}
        />
        <span
          className="animate-portal-blob-c absolute bottom-[-5%] left-[18%] h-[60%] w-[65%] rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "0s, -13s" }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg/35" />

      <div className="relative flex flex-col items-center gap-10">
        <div className="w-full max-w-[280px]">
          <ProcessLoop steps={steps} label={label} bare />
        </div>

        <Link
          href={`/${locale}/work/3d/metaverse`}
          className="inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint-strong)] px-8 py-4 font-mono text-sm font-semibold uppercase tracking-wide text-text shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
        >
          <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 16px 2px ${accent}` }} />
          {t.metaverse.cta}
        </Link>
      </div>
    </div>
  );
}
