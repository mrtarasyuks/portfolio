"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { DrumProjectCard, DrumComingSoonCard } from "@/components/hero/DrumProjectCard";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const RADIUS = 230;
const ROTATE_SPEED_DEG_PER_SEC = 8;
/** How far (in degrees) a card can be from dead-center-front before it's fully faded/shrunk. */
const FALLOFF_DEG = 130;
/** Flat count of numbered "Block N" placeholder slots appended after real projects — a demo aid
 * so the drum reads as a full reel while the world only has 1-2 real projects, not a responsive
 * pad-to-N. Swap/remove once there's enough real content. */
const GHOST_COUNT = 5;
const DRAG_SENSITIVITY = 0.55;
const DRAG_THRESHOLD_PX = 4;
const VELOCITY_DECAY = 2.6;

/**
 * Right-side glass block on the homepage — a vertical "slot machine drum": cards sit around a
 * circle on the X axis (rotateX moves them up/down, exactly the "vertical reel" read) and the
 * whole group spins continuously. Each card's own position transform stays static; only the
 * group's transform and each card's opacity/scale (by how close it currently is to front-center)
 * are mutated directly via refs every frame — driven by a plain requestAnimationFrame loop rather
 * than React state, so a continuous 3D spin doesn't force a re-render 60 times a second. Vertical
 * pointer-drag spins it manually with a decaying flick velocity, same physics idiom as the
 * avatar's own drag-rotate, blending back into the idle auto-spin once the flick settles.
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
  const slots = useMemo(
    () => [
      ...projects.map((p) => ({ key: p.slug, project: p as PortfolioProject | null, ghostLabel: null as string | null })),
      ...Array.from({ length: GHOST_COUNT }, (_, i) => ({
        key: `${world}-ghost-${i}`,
        project: null as PortfolioProject | null,
        ghostLabel: `${t.orbit.blockLabel} ${i + 1}`,
      })),
    ],
    [projects, world, t.orbit.blockLabel]
  );
  const segmentAngle = 360 / slots.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const dragStarted = useRef(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const reducedMotion = useRef(false);

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
      if (!dragging.current) return;
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

      if (dragging.current && dragStarted.current) {
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

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="pointer-events-auto relative h-[60vh] min-h-[420px] w-[300px] cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing sm:w-[360px]"
      style={{ perspective: 1400 }}
    >
      <div ref={groupRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {slots.map((slot, i) => (
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
            {slot.project ? (
              <DrumProjectCard project={slot.project} locale={locale} t={t} />
            ) : (
              <DrumComingSoonCard label={slot.ghostLabel ?? t.orbit.comingSoon} world={world} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
