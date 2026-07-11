"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getWorldTheme } from "@/content/worldTheme";
import { worlds, type Locale, type ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const GLYPH_BY_WORLD: Record<ProjectWorld, string> = {
  developers: "</>",
  "3d": "◆",
  video: "▷",
};

const FLY_DURATION_MS = 850;
/** The black overlay starts fading in partway through the fly-forward motion, not after it — the two beats overlap for a smoother feel than a hard cut. */
const BLACKOUT_DELAY_MS = 480;
const BLACKOUT_DURATION_MS = 420;
const NAVIGATE_DELAY_MS = BLACKOUT_DELAY_MS + BLACKOUT_DURATION_MS;
const MAX_TILT_DEG = 10;
const TILT_RESET = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";

/** The three world blocks fade/rise in on mount; clicking one flies it forward toward the viewer while the other two fade away, then the screen darkens to black right as the real navigation happens. */
export function WorldChooserBlocks({ locale, t }: { locale: Locale; t: CopyDict }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [zoomingInto, setZoomingInto] = useState<ProjectWorld | null>(null);
  const [blackout, setBlackout] = useState(false);
  // The fly animation needs to move the clicked block toward viewport-center, not just grow it
  // in place — without this, only a block that already sits near the horizontal center (Video,
  // the middle grid column) reads as flying "into" anything; the outer two just grow sideways.
  const [flyOffset, setFlyOffset] = useState<{ dx: number; dy: number } | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Tilt-toward-cursor hover: rotates the block in place around its own center, following the
  // pointer's position within it — deliberately rotation-only (no translate), so the block never
  // drifts across the screen the way the earlier `-translate-y-1` hover effect did.
  function handlePanelPointerMove(e: React.PointerEvent<HTMLButtonElement>, index: number) {
    const el = panelRefs.current[index];
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "transform 80ms ease-out";
    el.style.transform = `perspective(800px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) scale(1.03)`;
  }

  function handlePanelPointerLeave(index: number) {
    const el = panelRefs.current[index];
    if (!el) return;
    el.style.transition = "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = TILT_RESET;
  }

  function handleSelect(world: ProjectWorld, index: number) {
    if (zoomingInto) return;
    const el = buttonRefs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      setFlyOffset({
        dx: window.innerWidth / 2 - (rect.left + rect.width / 2),
        dy: window.innerHeight / 2 - (rect.top + rect.height / 2),
      });
    }
    setZoomingInto(world);
    window.setTimeout(() => setBlackout(true), BLACKOUT_DELAY_MS);
    window.setTimeout(() => router.push(`/${locale}/work/${world}`), NAVIGATE_DELAY_MS);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {worlds.map((w, i) => {
          const theme = getWorldTheme(w);
          const isTarget = zoomingInto === w;
          const isFadingOut = zoomingInto !== null && !isTarget;

          const flyTransform = flyOffset
            ? `translate(${flyOffset.dx}px, ${flyOffset.dy}px) scale(3.2)`
            : "scale(3.2)";

          return (
            <button
              key={w}
              type="button"
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              onClick={() => handleSelect(w, i)}
              onPointerMove={(e) => handlePanelPointerMove(e, i)}
              onPointerLeave={() => handlePanelPointerLeave(i)}
              aria-label={t.orbit.worlds[w]}
              className="group relative cursor-pointer text-left transition-all"
              style={{
                "--world-glow": theme.signal,
                position: "relative",
                zIndex: isTarget ? 40 : 0,
                transitionTimingFunction: isTarget ? "cubic-bezier(0.16, 1, 0.3, 1)" : "ease-out",
                transitionDuration: isTarget ? `${FLY_DURATION_MS}ms` : "600ms",
                transitionDelay: mounted ? `${i * 90}ms` : "0ms",
                opacity: mounted ? (isFadingOut ? 0 : 1) : 0,
                transform: !mounted ? "translateY(18px) scale(0.97)" : isTarget ? flyTransform : "translateY(0) scale(1)",
              } as React.CSSProperties}
            >
              <div
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                style={{ transformStyle: "preserve-3d", transform: TILT_RESET }}
              >
                <GlassPanel
                  className="flex h-56 flex-col justify-between p-6 transition-shadow duration-300 group-hover:shadow-[0_0_70px_-14px_var(--world-glow)] sm:h-64"
                  style={{ boxShadow: isTarget ? `0 0 90px -10px ${theme.signal}` : undefined }}
                >
                  <span className="font-mono text-2xl" style={{ color: theme.signal }} aria-hidden>
                    {GLYPH_BY_WORLD[w]}
                  </span>
                  <div>
                    <h2 className="text-xl font-medium text-text transition-colors group-hover:text-[var(--world-glow)]">
                      {t.orbit.worlds[w]}
                    </h2>
                    <p className="mt-2 text-sm text-text-muted">{t.orbit.worldTagline[w]}</p>
                  </div>
                </GlassPanel>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-50 bg-black transition-opacity"
        style={{ transitionDuration: `${BLACKOUT_DURATION_MS}ms`, opacity: blackout ? 1 : 0 }}
        aria-hidden
      />
    </>
  );
}
