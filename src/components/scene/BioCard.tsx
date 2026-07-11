"use client";

import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { profile } from "@/content/profile";
import { TypewriterText } from "@/components/ui/TypewriterText";
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
 * is already governed by distanceFactor/scale, not by viewport width, so a breakpoint-varying
 * width served no purpose here and actively worked against a true cube: HALF_DEPTH has to equal
 * exactly half of CARD_WIDTH for the four side faces to form a square (not elongated) footprint.
 */
const CARD_WIDTH = 540;
const HALF_DEPTH = CARD_WIDTH / 2;
const START_ANGLE_DEG = 26;
const DRAG_SENSITIVITY_DEG = 0.3;
const VELOCITY_DECAY = 3.2;
const OPAQUE_FACE_BG = "#101013";

type SpinState = { value: number; velocity: number };

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

/** A side of the cube that isn't the bio face — a plain photo once supplied, a solid (never
 * see-through) placeholder until then, same "wire the prop, ship a real file later" pattern as
 * hasPortrait. Deliberately opaque, not glass — the cube reads as a solid object, not a window. */
function PhotoFace({ src, has }: { src: string; has: boolean }) {
  return (
    <div
      className="h-full w-full bg-cover bg-center"
      style={{
        backgroundColor: OPAQUE_FACE_BG,
        ...(has ? { backgroundImage: `url(${src})` } : undefined),
      }}
    />
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
              style={{ width: CARD_WIDTH, transformStyle: "preserve-3d", pointerEvents: "auto" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <CubeFace rotateDeg={90}>
                <PhotoFace src={BIO_CARD_PHOTO_RIGHT_SRC} has={hasPhotoRight} />
              </CubeFace>
              <CubeFace rotateDeg={180}>
                <PhotoFace src={BIO_CARD_PHOTO_BACK_SRC} has={hasPhotoBack} />
              </CubeFace>
              <CubeFace rotateDeg={-90}>
                <PhotoFace src={BIO_CARD_PHOTO_LEFT_SRC} has={hasPhotoLeft} />
              </CubeFace>

              {/* Front face — normal document flow, so its content is what actually sets the cube's height. Solid, not glass: an opaque backing so the text stays legible regardless of what's behind it in the scene. */}
              <div
                className="relative w-full bg-gradient-to-b from-[#18181c] to-[#0c0c0e] shadow-[0_60px_140px_-25px_rgba(0,0,0,0.85)]"
                style={{ filter: `drop-shadow(0 0 26px ${color}45)`, transform: `translateZ(${HALF_DEPTH}px)` }}
              >
                {/* Contain, not cover — the photo must render in full, never cropped. Matches the source photo's own aspect ratio (659:781) so there's effectively no letterboxing either. */}
                <div
                  className="aspect-[659/781] w-full bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundColor: OPAQUE_FACE_BG,
                    ...(hasPortrait ? { backgroundImage: `url(${BIO_CARD_PORTRAIT_SRC})` } : undefined),
                  }}
                />

                <div className="border-t px-6 py-6" style={{ borderColor: `${color}40` }}>
                  <p className="font-display text-[30px] font-bold normal-case leading-snug text-white">{profile.name}</p>
                  <p className="mt-1.5 font-mono text-base font-semibold uppercase tracking-wide" style={{ color }}>
                    <TypewriterText text={t.bioCard.role} speedMs={18} />
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 gap-4 border-t px-6 py-5 font-mono text-sm uppercase tracking-wide text-white/55"
                  style={{ borderColor: `${color}40` }}
                >
                  <div>
                    <p>{t.bioCard.ageLabel}</p>
                    <p className="mt-1 normal-case text-lg font-semibold text-white">{t.bioCard.age}</p>
                  </div>
                  <div>
                    <p>{t.bioCard.countryLabel}</p>
                    <p className="mt-1 normal-case text-lg font-semibold text-white">{profile.location}</p>
                  </div>
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: `${color}40` }}>
                  <p className="font-mono text-sm uppercase tracking-wide text-white/55">{t.bioCard.hobbiesLabel}</p>
                  <p className="mt-2 text-base normal-case font-semibold leading-snug text-white">{t.bioCard.hobbies.join(" · ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
