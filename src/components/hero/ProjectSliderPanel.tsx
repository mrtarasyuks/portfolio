"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DrumProjectCard, DrumVideoCard, DrumComingSoonCard } from "@/components/hero/DrumProjectCard";
import { getWorldTheme } from "@/content/worldTheme";
import { videos } from "@/content/videos";
import { cn } from "@/lib/cn";
import type { PortfolioProject, Locale, ProjectWorld } from "@/content/types";
import type { VideoItem } from "@/content/videos";
import type { CopyDict } from "@/content/copy";

/** How many real clips populate the Video Creator world's drum - the rest of that world's slots
 * are the usual "Soon" ghosts, same as every other world. */
const DRUM_VIDEO_PICK_COUNT = 6;

type Slot =
  | { kind: "project"; key: string; project: PortfolioProject }
  | { kind: "video"; key: string; video: VideoItem }
  | { kind: "soon"; key: string };

type Selected = { kind: "project"; slug: string } | { kind: "video"; category: string; src: string };

const RADIUS = 230;
const ROTATE_SPEED_DEG_PER_SEC = 8;
/** How far (in degrees) a card can be from dead-center-front before it's fully faded/shrunk. */
const FALLOFF_DEG = 130;
const DRAG_SENSITIVITY = 0.55;
const DRAG_THRESHOLD_PX = 4;
const VELOCITY_DECAY = 2.6;
/** A card can only be caught/selected while it's sitting within this many degrees of dead-center —
 * clicking a card elsewhere on the drum (still faded/tilted away) is a no-op, so a click always
 * reads as "I picked the one currently facing me," not "I picked whichever one my cursor happened
 * to land on mid-spin." */
const SELECT_CENTER_TOLERANCE_DEG = 20;
/** A couple of blurred "more landing here soon" ghost slots appended after each world's real
 * projects — every world gets these regardless of how many real cards it already has. */
const SOON_SLOTS_PER_WORLD = 2;

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
 * Clicking a card freezes the spin in place (no fly-to-viewport-center/blackout — that effect was
 * removed) and selects it: the card highlights (accent-colored outline glow) and pops slightly
 * forward via its own local `translateZ` (handled in `DrumProjectCard`, driven by `isSelected`), and
 * a "View case study"/"Back" pill pair fades in below it. "Back" clears the selection and resumes
 * the idle spin; "View case study" navigates. The button pair is a plain 2D overlay, a sibling of
 * the 3D `groupRef` tree rather than a descendant of it, so it isn't subject to the group's
 * `perspective`/`preserve-3d` and always renders flat and legible regardless of the selected card's
 * current rotation.
 */
export function ProjectSliderPanel({
  projects,
  world,
  locale,
  t,
  logoBySlug,
}: {
  projects: PortfolioProject[];
  world: ProjectWorld;
  locale: Locale;
  t: CopyDict;
  logoBySlug: Record<string, boolean>;
}) {
  const router = useRouter();

  // The video world has no `PortfolioProject` entries (real clips live in content/videos.ts,
  // grouped by genre rather than tied to a single case study) - picked client-side in an effect,
  // not during render, since this project's own rule forbids Math.random() in the render body
  // (same pattern VideosByCategory already uses for its own random per-category picks).
  const [videoPicks, setVideoPicks] = useState<VideoItem[]>([]);
  useEffect(() => {
    if (world !== "video") return;
    const id = requestAnimationFrame(() => {
      const pool = [...videos];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setVideoPicks(pool.slice(0, DRUM_VIDEO_PICK_COUNT));
    });
    return () => cancelAnimationFrame(id);
  }, [world]);

  const slots = useMemo<Slot[]>(() => {
    const real: Slot[] =
      world === "video"
        ? videoPicks.map((v) => ({ kind: "video", key: v.src, video: v }))
        : projects.map((p) => ({ kind: "project", key: p.slug, project: p }));
    const soon: Slot[] = Array.from({ length: SOON_SLOTS_PER_WORLD }, (_, i) => ({
      kind: "soon",
      key: `${world}-soon-${i}`,
    }));
    return [...real, ...soon];
  }, [projects, world, videoPicks]);
  const segmentAngle = 360 / slots.length;
  const accent = getWorldTheme(world).signal;

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
  const frozen = useRef(false);

  const [selected, setSelected] = useState<Selected | null>(null);

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
        // A card is selected — leave rotation exactly where it stopped.
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

  function handleSelect(candidate: Selected, index: number) {
    if (selected) return;
    const angle = ((index * segmentAngle + rotation.current) % 360 + 360) % 360;
    const normalized = angle > 180 ? angle - 360 : angle;
    if (Math.abs(normalized) > SELECT_CENTER_TOLERANCE_DEG) return;
    frozen.current = true;
    dragging.current = false;
    setSelected(candidate);
  }

  function handleBack() {
    setSelected(null);
    frozen.current = false;
  }

  function handleViewCase() {
    if (!selected) return;
    const href = selected.kind === "project" ? `/${locale}/work/${selected.slug}` : `/${locale}/work/video/${selected.category}`;
    router.push(href);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={cn(
        "pointer-events-auto relative h-[60vh] min-h-[420px] w-[300px] cursor-grab touch-none select-none active:cursor-grabbing sm:w-[360px]",
        selected ? "overflow-visible" : "overflow-hidden"
      )}
      style={{ perspective: 1400 }}
    >
      <div ref={groupRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {slots.map((slot, i) => {
          const isSelected =
            (slot.kind === "project" && selected?.kind === "project" && selected.slug === slot.project.slug) ||
            (slot.kind === "video" && selected?.kind === "video" && selected.src === slot.video.src);

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
                zIndex: isSelected ? 20 : undefined,
              }}
            >
              {slot.kind === "project" ? (
                <DrumProjectCard
                  project={slot.project}
                  locale={locale}
                  t={t}
                  isSelected={isSelected}
                  hasLogo={logoBySlug[slot.project.slug] ?? false}
                  onSelect={() => handleSelect({ kind: "project", slug: slot.project.slug }, i)}
                />
              ) : slot.kind === "video" ? (
                <DrumVideoCard
                  video={slot.video}
                  t={t}
                  isSelected={isSelected}
                  onSelect={() => handleSelect({ kind: "video", category: slot.video.category, src: slot.video.src }, i)}
                />
              ) : (
                <DrumComingSoonCard label={t.orbit.comingSoon} world={world} accent={accent} />
              )}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 flex justify-center gap-3 transition-all duration-300",
          selected ? "translate-y-[168px] opacity-100" : "translate-y-[140px] opacity-0"
        )}
      >
        <button
          type="button"
          onClick={handleViewCase}
          disabled={!selected}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-[0_16px_36px_-14px_rgba(0,0,0,0.7)] transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: accent, color: "#0c0c0e" }}
        >
          {t.orbit.viewProject}
          <span aria-hidden>→</span>
        </button>
        <button
          type="button"
          onClick={handleBack}
          disabled={!selected}
          className="pointer-events-auto rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint-strong)] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-text backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
        >
          {t.orbit.back}
        </button>
      </div>
    </div>
  );
}
