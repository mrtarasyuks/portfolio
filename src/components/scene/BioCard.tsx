"use client";

import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { profile } from "@/content/profile";
import {
  BIO_CARD_PORTRAIT_SRC,
  BIO_CARD_PHOTO_RIGHT_SRC,
  BIO_CARD_PHOTO_BACK_SRC,
  BIO_CARD_PHOTO_LEFT_SRC,
} from "@/content/assetPaths";
import type { CopyDict } from "@/content/copy";

/**
 * Left side, roughly chest height. `distanceFactor` is unchanged from the original tuning (7.2)
 * deliberately — drei's Html scales content by distanceFactor itself (higher number = bigger on
 * screen, the opposite of what a first read of the name suggests) — the card's on-screen size is
 * instead driven purely by the outer `scale(0.5)` wrapper below, so distanceFactor never moves.
 */
export const BIO_CARD_ANCHOR: [number, number, number] = [-3.6, 0.15, 0.3];

/**
 * One fixed size (not a responsive sm: pair) — this is a 3D-anchored element whose on-screen size
 * is already governed by distanceFactor/scale, not by viewport width. HALF_DEPTH has to equal
 * exactly half of CARD_WIDTH for the rotation to sweep a square (not elongated) footprint — that
 * relationship only constrains the horizontal/depth axis; FACE_HEIGHT (vertical) is independent of
 * the Y-axis rotation math and can differ freely.
 */
const CARD_WIDTH = 540;
const HALF_DEPTH = CARD_WIDTH / 2;
const FACE_HEIGHT = 720;
const START_ANGLE_DEG = 26;
const DRAG_SENSITIVITY_DEG = 0.3;
const VELOCITY_DECAY = 3.2;
const OPAQUE_FACE_BG = "#101013";

type SpinState = { value: number; velocity: number };

type Experience = { title: string; description: string; photoSrc: string; hasPhoto: boolean };

function CubeFace({ rotateDeg, children }: { rotateDeg: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `rotateY(${rotateDeg}deg) translateZ(${HALF_DEPTH}px)`, backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  );
}

/**
 * One uniform face for all four sides of the cube — a "signage" plaque (age + country, styled
 * to look like a lit sign mounted on the block) standing fully above the face's top edge, a
 * full-height "adapted" (cropped-to-fill) photo, and a text section overlaid near the bottom with
 * a barely-transparent scrim so it reads as its own distinct panel over the photo rather than a
 * half-height crop. `h-full` throughout (not content-driven flow) so all four faces resolve to the
 * exact same height regardless of each description's length — the parent cube wrapper carries the
 * one explicit `FACE_HEIGHT`.
 */
function ExperienceFace({
  experience,
  age,
  country,
  color,
}: {
  experience: Experience;
  age: string;
  country: string;
  color: string;
}) {
  return (
    <div
      className="relative h-full w-full bg-gradient-to-b from-[#18181c] to-[#0c0c0e] shadow-[0_60px_140px_-25px_rgba(0,0,0,0.85)]"
      style={{ filter: `drop-shadow(0 0 26px ${color}45)` }}
    >
      {/* Signage — stands fully above the face's top edge, like a sign mounted on top of the block, pushed proud via translateZ. */}
      <div
        className="absolute bottom-full left-1/2 z-10 mb-4 flex items-center gap-3 whitespace-nowrap rounded-full px-10 py-4"
        style={{
          transform: "translateX(-50%) translateZ(30px)",
          background: `linear-gradient(160deg, ${color}33, rgba(8,8,10,0.94))`,
          border: `1px solid ${color}70`,
          boxShadow: `0 18px 40px -10px rgba(0,0,0,0.75), 0 0 36px -4px ${color}90, inset 0 1px 0 rgba(255,255,255,0.16)`,
        }}
      >
        <span
          className="font-display text-4xl font-black leading-none text-white"
          style={{ textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 8px 18px rgba(0,0,0,0.65)" }}
        >
          {age}
        </span>
        <span className="font-mono text-base font-semibold uppercase leading-none tracking-wide" style={{ color }}>
          {country}
        </span>
      </div>

      {/* Full-height adapted (cropped-to-fill) photo. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundColor: OPAQUE_FACE_BG,
          ...(experience.hasPhoto ? { backgroundImage: `url(${experience.photoSrc})` } : undefined),
        }}
      />

      {/* Text section overlaid near the bottom — barely-transparent scrim, not a half-height split. */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-8 py-6"
        style={{ background: "rgba(8,8,10,0.82)", backdropFilter: "blur(10px)", borderTop: `1px solid ${color}40` }}
      >
        <h3 className="font-display text-[34px] font-black leading-[1.05] text-white">{experience.title}</h3>
        <p className="text-lg font-semibold leading-snug text-white/85">{experience.description}</p>
      </div>
    </div>
  );
}

export function BioCard({
  t,
  color,
  hasPortrait,
  hasPhotoRight,
  hasPhotoBack,
  hasPhotoLeft,
  reducedMotion = false,
}: {
  t: CopyDict;
  color: string;
  hasPortrait: boolean;
  hasPhotoRight: boolean;
  hasPhotoBack: boolean;
  hasPhotoLeft: boolean;
  reducedMotion?: boolean;
}) {
  const spinRef = useRef<HTMLDivElement>(null);
  const spin = useRef<SpinState>({ value: START_ANGLE_DEG, velocity: 0 });
  const dragging = useRef(false);
  const lastX = useRef(0);

  const [pm, aiDev, videoCreator, printMaker] = t.bioCard.experiences;
  const faces: [number, Experience][] = [
    [0, { ...pm, photoSrc: BIO_CARD_PORTRAIT_SRC, hasPhoto: hasPortrait }],
    [90, { ...aiDev, photoSrc: BIO_CARD_PHOTO_RIGHT_SRC, hasPhoto: hasPhotoRight }],
    [180, { ...videoCreator, photoSrc: BIO_CARD_PHOTO_BACK_SRC, hasPhoto: hasPhotoBack }],
    [-90, { ...printMaker, photoSrc: BIO_CARD_PHOTO_LEFT_SRC, hasPhoto: hasPhotoLeft }],
  ];

  // Continuous rAF loop mutating the transform directly via a ref, not React state — same idiom
  // as the homepage drum carousel, so a mid-drag 60fps update never forces a React re-render.
  // This node only ever carries perspective()/rotateY() — the half-size scale() lives on a
  // separate, static outer wrapper (see JSX below) specifically so the two never compound: an
  // earlier version chained scale() into the same transform as perspective(), which shrinks the
  // effective perspective distance the cube's own children see and reads as a stretched/elongated
  // box rather than a true cube, for the same "one CSS operation per concern" reason distanceFactor
  // and the width increase were kept separate in this card's very first version.
  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging.current && spin.current.velocity !== 0) {
        spin.current.velocity *= Math.max(0, 1 - delta * VELOCITY_DECAY);
        if (Math.abs(spin.current.velocity) < 0.02) spin.current.velocity = 0;
        spin.current.value += spin.current.velocity;
      }
      if (spinRef.current) {
        spinRef.current.style.transform = `perspective(2200px) rotateY(${spin.current.value}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    lastX.current = e.clientX;
    spin.current.velocity = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const rotationDelta = deltaX * DRAG_SENSITIVITY_DEG;
    spin.current.value += rotationDelta;
    spin.current.velocity = reducedMotion ? 0 : rotationDelta;
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  return (
    <group position={BIO_CARD_ANCHOR}>
      <Html center distanceFactor={7.2} zIndexRange={[0, 60]} style={{ pointerEvents: "none" }}>
        <div style={{ transform: "scale(0.5)" }}>
          <div
            ref={spinRef}
            style={{ transform: `perspective(2200px) rotateY(${START_ANGLE_DEG}deg)`, transformStyle: "preserve-3d" }}
          >
            <div
              className="relative cursor-grab touch-none select-none active:cursor-grabbing"
              style={{ width: CARD_WIDTH, height: FACE_HEIGHT, transformStyle: "preserve-3d", pointerEvents: "auto" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {faces.map(([rotateDeg, experience]) => (
                <CubeFace key={rotateDeg} rotateDeg={rotateDeg}>
                  <ExperienceFace experience={experience} age={t.bioCard.age} country={profile.location} color={color} />
                </CubeFace>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
