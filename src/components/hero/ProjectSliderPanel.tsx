"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DrumProjectCard, DrumComingSoonCard } from "@/components/hero/DrumProjectCard";
import { cn } from "@/lib/cn";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const RADIUS = 230;
const ROTATE_SPEED_DEG_PER_SEC = 8;
/** How far (in degrees) a card can be from dead-center-front before it's fully faded/shrunk. */
const FALLOFF_DEG = 130;
const DRAG_SENSITIVITY = 0.55;
const DRAG_THRESHOLD_PX = 4;
const VELOCITY_DECAY = 2.6;
/** A button-triggered spin just injects a big one-off velocity into the same flick-decay physics
 * a manual drag already produces — reusing the existing `VELOCITY_DECAY` curve rather than a
 * separate spin-up/spin-down animation, so it settles back into the idle auto-spin exactly the
 * way a real flick does. Clicks stack (capped) instead of resetting, so a second tap mid-spin adds momentum. */
const SPIN_KICK_DEG = 34;
const MAX_SPIN_VELOCITY_DEG = 70;

/** Same fly-to-center transition timing `WorldChooserBlocks` uses for the `/work` index blocks —
 * reused verbatim rather than inventing new numbers, so both feel like one consistent interaction. */
const FLY_DURATION_MS = 850;
const BLACKOUT_DELAY_MS = 480;
const BLACKOUT_DURATION_MS = 420;
const NAVIGATE_DELAY_MS = BLACKOUT_DELAY_MS + BLACKOUT_DURATION_MS;

/**
 * Right-side glass block on the homepage — a vertical "slot machine drum": cards sit around a
 * circle on the X axis (rotateX moves them up/down, exactly the "vertical reel" read) and the
 * whole group spins continuously. Each card's own position transform stays static; only the
 * group's transform and each card's opacity/scale (by how close it currently is to front-center)
 * are mutated directly via refs every frame — driven by a plain requestAnimationFrame loop rather
 * than React state, so a continuous 3D spin doesn't force a re-render 60 times a second. Vertical
 * pointer-drag spins it manually with a decaying flick velocity, same physics idiom as the
 * avatar's own drag-rotate, blending back into the idle auto-spin once the flick settles.
 *
 * Clicking a card freezes the spin, then flies that one card toward viewport-center and fades to
 * black before navigating — the exact same state-driven transition `WorldChooserBlocks` already
 * established for the `/work` index blocks (measure the clicked element's rect once, store the
 * offset in state, let JSX apply the transform), reused here instead of a plain same-page `<Link>`.
 * The container's `overflow-hidden` (needed the rest of the time — 3D `translateZ` cards can bleed
 * past a distant ancestor's clip and inflate `document.scrollWidth`) is switched to visible only
 * while a card is actually flying past the panel's own bounds toward center.
 */
export function ProjectSliderPanel({
  projects,
  world,
  locale,
  t,
}: {
  projects: PortfolioProject[];
  world: ProjectWorld;
  locale: Locale;
  t: CopyDict;
}) {
  const router = useRouter();
  const slots = useMemo(
    () =>
      projects.length > 0
        ? projects.map((p) => ({ key: p.slug, project: p as PortfolioProject | null }))
        : [{ key: `${world}-ghost`, project: null as PortfolioProject | null }],
    [projects, world]
  );
  const segmentAngle = 360 / slots.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const dragStarted = useRef(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const reducedMotion = useRef(false);
  const frozen = useRef(false);

  const [zoomingSlug, setZoomingSlug] = useState<string | null>(null);
  const [flyOffset, setFlyOffset] = useState<{ dx: number; dy: number } | null>(null);
  const [blackout, setBlackout] = useState(false);

  const applyFrame = useCallback(() => {
    if (groupRef.current) groupRef.current.style.transform = `rotateX(${rotation.current}deg)`;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const angle = (i * segmentAngle + rotation.current) % 360;
      const normalized = angle > 180 ? angle - 360 : angle;
      const closeness = 1 - Math.min(1, Math.abs(normalized) / FALLOFF_DEG);
      el.style.opacity = String(0.22 + 0.78 * closeness);
      el.style.setProperty("--card-scale", String(0.76 + 0.28 * closeness));
    });
  }, [segmentAngle]);

  const handleWindowPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || frozen.current) return;
      const deltaY = e.clientY - lastY.current;
      lastY.current = e.clientY;
      if (!dragStarted.current && Math.abs(e.clientY - startY.current) > DRAG_THRESHOLD_PX) {
        dragStarted.current = true;
      }
      if (!dragStarted.current) return;
      const rotationDelta = -deltaY * DRAG_SENSITIVITY;
      rotation.current += rotationDelta;
      velocity.current = rotationDelta;
      applyFrame();
    },
    [applyFrame]
  );

  const handleWindowPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", handleWindowPointerMove);
  }, [handleWindowPointerMove]);

  function handlePointerDown(e: React.PointerEvent) {
    if (frozen.current) return;
    dragging.current = true;
    dragStarted.current = false;
    startY.current = e.clientY;
    lastY.current = e.clientY;
    velocity.current = 0;
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp, { once: true });
    window.addEventListener("pointercancel", handleWindowPointerUp, { once: true });
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [handleWindowPointerMove, handleWindowPointerUp]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mql.matches;

    if (mql.matches) {
      applyFrame();
      return;
    }

    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const delta = (now - last) / 1000;
      last = now;

      if (frozen.current) {
        // Selected card is flying to center — leave rotation exactly where it stopped so the
        // outer positioning transform (which the fly transform layers on top of) stays static.
      } else if (dragging.current && dragStarted.current) {
        // rotation/velocity already updated directly by the window pointermove handler
      } else {
        velocity.current *= Math.max(0, 1 - delta * VELOCITY_DECAY);
        if (Math.abs(velocity.current) < 0.01) velocity.current = 0;
        rotation.current += velocity.current + delta * ROTATE_SPEED_DEG_PER_SEC;
      }
      rotation.current %= 360;

      applyFrame();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyFrame]);

  function handleSelect(slug: string, index: number) {
    if (zoomingSlug) return;
    frozen.current = true;
    dragging.current = false;

    const el = flyRefs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      setFlyOffset({
        dx: window.innerWidth / 2 - (rect.left + rect.width / 2),
        dy: window.innerHeight / 2 - (rect.top + rect.height / 2),
      });
    }

    setZoomingSlug(slug);
    window.setTimeout(() => setBlackout(true), BLACKOUT_DELAY_MS);
    window.setTimeout(() => router.push(`/${locale}/work/${slug}`), NAVIGATE_DELAY_MS);
  }

  function handleSpin() {
    if (frozen.current || reducedMotion.current) return;
    velocity.current = Math.min(velocity.current + SPIN_KICK_DEG, MAX_SPIN_VELOCITY_DEG);
  }

  return (
    <div className="flex items-center gap-4">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className={cn(
          "pointer-events-auto relative h-[60vh] min-h-[420px] w-[300px] cursor-grab touch-none select-none active:cursor-grabbing sm:w-[360px]",
          zoomingSlug ? "overflow-visible" : "overflow-hidden"
        )}
        style={{ perspective: 1400 }}
      >
        <div ref={groupRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {slots.map((slot, i) => {
            const isTarget = slot.project && zoomingSlug === slot.project.slug;
            const flyTransform = flyOffset ? `translate(${flyOffset.dx}px, ${flyOffset.dy}px) scale(3.2)` : "scale(3.2)";

            return (
              <div
                key={slot.key}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-1/2 flex justify-center"
                style={{
                  transform: `translateY(-50%) rotateX(${i * segmentAngle}deg) translateZ(${RADIUS}px) scale(var(--card-scale, 1))`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  ref={(el) => {
                    flyRefs.current[i] = el;
                  }}
                  style={
                    isTarget
                      ? {
                          position: "relative",
                          zIndex: 40,
                          transitionProperty: "transform",
                          transitionDuration: `${FLY_DURATION_MS}ms`,
                          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                          transform: flyTransform,
                        }
                      : undefined
                  }
                >
                  {slot.project ? (
                    <DrumProjectCard
                      project={slot.project}
                      locale={locale}
                      t={t}
                      onSelect={() => handleSelect(slot.project!.slug, i)}
                    />
                  ) : (
                    <DrumComingSoonCard label={t.orbit.comingSoon} world={world} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-none fixed inset-0 z-50 bg-black transition-opacity"
          style={{ transitionDuration: `${BLACKOUT_DURATION_MS}ms`, opacity: blackout ? 1 : 0 }}
          aria-hidden
        />
      </div>

      <SpinButton onSpin={handleSpin} label={t.orbit.spin} />
    </div>
  );
}

/** Voluminous round glass knob beside the drum — a physical-feeling control, not a flat icon
 * button, matching the same thick-glass language `BackToWorkButton`/`GlassPanel` establish
 * elsewhere. The chevron ring spins once on each press purely as click feedback; the drum's own
 * spin is driven by the real velocity physics in the parent, not by this animation. */
function SpinButton({ onSpin, label }: { onSpin: () => void; label: string }) {
  const [pulseKey, setPulseKey] = useState(0);

  return (
    <button
      type="button"
      onClick={() => {
        onSpin();
        setPulseKey((k) => k + 1);
      }}
      aria-label={label}
      title={label}
      className="pointer-events-auto flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint-strong)] text-text shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-90"
    >
      <svg
        key={pulseKey}
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="animate-spin-kick"
      >
        <path d="M3 12a9 9 0 1 1 3 6.7" />
        <path d="M3 12v5h5" />
      </svg>
    </button>
  );
}
