"use client";

import { useCallback, useEffect, useRef } from "react";

const AUTO_SPEED_PX_PER_SEC = 34;
const DRAG_THRESHOLD_PX = 4;
const WHEEL_MULTIPLIER = 1.15;
const VELOCITY_DECAY = 3.2;
/** Wide enough that one lap always clears the widest realistic viewport — same reasoning
 * `ToolLogosMarquee` uses for its own `REPEAT`, just driven by a JS position instead of a CSS
 * keyframe so the belt can also be dragged and wheel-scrolled. */
const REPEAT = 3;

/**
 * The Agent-native pipeline, read literally as an infinite belt — steps loop edge to edge instead
 * of ending, which doubles as the section's own thesis (agent loops don't stop). Two laps of the
 * repeated step list sit side by side; every frame the group's `translateX` is set to
 * `-(position mod lapWidth)`, so no matter how far `position` has drifted (idle drift, a drag
 * flick, or a wheel nudge), the visible offset always lands inside a single lap and the seam never
 * shows. Same rAF-driven-refs idiom `ProjectSliderPanel`'s drum carousel already uses, adapted from
 * a circular X-rotation to a linear X-translation.
 */
export function AgentLoopDiagram({ steps }: { steps: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lapRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const position = useRef(0);
  const velocity = useRef(0);
  const lapWidth = useRef(0);
  const dragging = useRef(false);
  const dragStarted = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const reducedMotion = useRef(false);

  const applyFrame = useCallback(() => {
    const width = lapWidth.current;
    if (!trackRef.current || width <= 0) return;
    const wrapped = ((position.current % width) + width) % width;
    trackRef.current.style.transform = `translateX(${-wrapped}px)`;
  }, []);

  const measure = useCallback(() => {
    if (lapRef.current) lapWidth.current = lapRef.current.getBoundingClientRect().width;
    applyFrame();
  }, [applyFrame]);

  const handleWindowPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      if (!dragStarted.current && Math.abs(e.clientX - startX.current) > DRAG_THRESHOLD_PX) {
        dragStarted.current = true;
      }
      if (!dragStarted.current) return;
      position.current -= deltaX;
      velocity.current = -deltaX;
      applyFrame();
    },
    [applyFrame]
  );

  const handleWindowPointerUp = useCallback(() => {
    dragging.current = false;
    if (rootRef.current) rootRef.current.style.cursor = "";
    window.removeEventListener("pointermove", handleWindowPointerMove);
  }, [handleWindowPointerMove]);

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    dragStarted.current = false;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    velocity.current = 0;
    if (rootRef.current) rootRef.current.style.cursor = "grabbing";
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

  // Native (non-passive) wheel listener — React's own onWheel is passive by default, which would
  // silently ignore preventDefault(). Without preventDefault, hovering the belt while the page
  // itself scrolls would fight the browser's own vertical scroll.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function handleWheel(e: WheelEvent) {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      position.current += delta * WHEEL_MULTIPLIER;
      velocity.current = delta * WHEEL_MULTIPLIER;
      applyFrame();
    }
    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => root.removeEventListener("wheel", handleWheel);
  }, [applyFrame]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (lapRef.current) ro.observe(lapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mql.matches;
    if (mql.matches) return;

    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const delta = (now - last) / 1000;
      last = now;

      if (dragging.current && dragStarted.current) {
        // position/velocity already updated directly by the pointermove/wheel handlers
      } else {
        velocity.current *= Math.max(0, 1 - delta * VELOCITY_DECAY);
        if (Math.abs(velocity.current) < 0.01) velocity.current = 0;
        position.current += velocity.current + delta * AUTO_SPEED_PX_PER_SEC;
      }

      applyFrame();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyFrame]);

  const lap = Array.from({ length: REPEAT }, () => steps).flat();
  const laps = [lap, lap];

  return (
    <div
      ref={rootRef}
      onPointerDown={handlePointerDown}
      className="cursor-grab touch-none select-none overflow-hidden py-2 active:cursor-grabbing"
      style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
    >
      <div ref={trackRef} className="flex w-max items-stretch">
        {laps.map((stepsInLap, lapIndex) => (
          <div
            key={lapIndex}
            ref={lapIndex === 0 ? lapRef : undefined}
            className="flex shrink-0 items-stretch gap-5 pr-5 md:gap-7 md:pr-7"
          >
            {stepsInLap.map((step, i) => (
              <FacetedStepCard key={`${lapIndex}-${i}`} index={i} step={step} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const FACET_CLIP =
  "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)";

function FacetedStepCard({ index, step }: { index: number; step: string }) {
  return (
    <div
      className="relative flex w-[220px] shrink-0 flex-col justify-between gap-6 border border-[var(--glass-border)] bg-[var(--glass-tint)] px-6 py-7 backdrop-blur-xl md:w-[260px] md:px-7 md:py-8"
      style={{ clipPath: FACET_CLIP }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: "linear-gradient(to right, transparent, var(--glass-specular), transparent)" }}
        aria-hidden
      />
      <span className="font-mono text-3xl font-black text-signal-text/70 md:text-4xl" aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-base font-medium leading-snug text-text md:text-lg">{step}</span>
    </div>
  );
}
