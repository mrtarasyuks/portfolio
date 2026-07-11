"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import type { Mesh, MeshBasicMaterial } from "three";
import type { ThemeMode } from "@/content/types";
import { FloorGrid } from "./FloorGrid";
import { FloatingDebris, makeDebrisField } from "./FloatingDebris";

const PRINT_X = -3.4;
const PRINT_Z = -5.5;
const TOTAL_PASSES = 8;
const LAYER_COUNT = 30;

const BAR_COUNT = 12;
const BAR_GAP = 0.2;
const BAR_SIZE = 0.28;
const BAR_HEIGHT = 0.17;

/** Three equalizer bar-stacks total — where the ring "vases" used to sit: the original
 * print-in-progress spot (left) plus two more on the opposite side of the avatar, further back. */
const RIGHT_VASE_A = { x: 3.5, z: -5.8 };
const RIGHT_VASE_B = { x: 6.6, z: -9.2 };

const AMBIENT_COUNT = 8;
const AMBIENT = Array.from({ length: AMBIENT_COUNT }, () => ({
  x: (Math.random() - 0.5) * 16,
  y: (Math.random() - 0.5) * 5,
  z: -8 - Math.random() * 8,
  r: 0.5 + Math.random() * 1,
  rotX: Math.random() * Math.PI,
  rotY: Math.random() * Math.PI,
}));

const DEBRIS = makeDebrisField(20, 21, 10, -3, 14);

type EqState = { level: number; target: number; timer: number; nextChange: number };

/** A vertical stack of equalizer bars, LED-meter style — where the pulsing torus "vase" used to
 * sit. Each bar has a fixed position/size (cheap, no geometry mutation) and a fixed color drawn
 * from a green→red spectrum by height, matching the classic audio-equalizer read; only its
 * opacity flips between "lit" and "dim" as a shared level (how many bars from the bottom are lit)
 * rises and falls on its own randomized cadence — faster as scrollSpeed rises, easing back down
 * to just the bottom bar the instant grid-scroll turns off. */
function EqualizerBars({
  anchorX,
  anchorZ,
  opacity,
  scrollSpeed,
}: {
  anchorX: number;
  anchorZ: number;
  opacity: number;
  scrollSpeed: number;
}) {
  const barRefs = useRef<(Mesh | null)[]>([]);
  const eq = useRef<EqState>({ level: 1, target: 1, timer: 0, nextChange: 0.15 });
  const barColors = useMemo(
    () => Array.from({ length: BAR_COUNT }, (_, i) => new Color().setHSL(0.34 - (i / BAR_COUNT) * 0.34, 0.8, 0.56)),
    []
  );

  useFrame((_, delta) => {
    const active = scrollSpeed > 0;
    const s = eq.current;
    if (active) {
      s.timer += delta * (1 + scrollSpeed * 2.5);
      if (s.timer > s.nextChange) {
        s.timer = 0;
        s.nextChange = 0.09 + Math.random() * 0.22;
        s.target = 1 + Math.random() * (BAR_COUNT - 1);
      }
    } else {
      s.target = 1;
    }
    s.level += (s.target - s.level) * Math.min(1, delta * 7);

    barRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const material = mesh.material as MeshBasicMaterial;
      const lit = i < s.level;
      material.opacity = lit ? opacity * 0.85 : opacity * 0.1;
    });
  });

  return (
    <group>
      {barColors.map((barColor, i) => (
        <mesh
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          position={[anchorX, -1.3 + i * BAR_GAP, anchorZ]}
        >
          <boxGeometry args={[BAR_SIZE, BAR_HEIGHT, BAR_SIZE]} />
          <meshBasicMaterial color={barColor} transparent opacity={opacity * 0.1} />
        </mesh>
      ))}
    </group>
  );
}

export function PrintRingField({
  color,
  opacity,
  paused,
  scrollSpeed = 0,
  theme,
}: {
  color: string;
  opacity: number;
  paused: boolean;
  scrollSpeed?: number;
  theme?: ThemeMode;
}) {
  const headRef = useRef<Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;
    t.current += delta * 0.4;
    // raster path: sweep, step up a layer, sweep back — an actual print-head route, not a sine bob
    const cycle = t.current % (TOTAL_PASSES * 2);
    const pass = Math.floor(cycle / 2);
    const wave = cycle % 2;
    const x = PRINT_X + ((wave <= 1 ? wave : 2 - wave) - 0.5) * 2.2;
    const y = -1.3 + (pass / TOTAL_PASSES) * (LAYER_COUNT * 0.1);
    if (headRef.current) headRef.current.position.set(x, y, PRINT_Z + 1.1);
  });

  return (
    <group>
      <FloorGrid color={color} opacity={opacity * 0.24} position={[0, -1.85, -5]} size={22} divisions={22} scrollSpeed={scrollSpeed} theme={theme} />

      <EqualizerBars anchorX={PRINT_X} anchorZ={PRINT_Z} opacity={opacity} scrollSpeed={scrollSpeed} />
      <EqualizerBars anchorX={RIGHT_VASE_A.x} anchorZ={RIGHT_VASE_A.z} opacity={opacity} scrollSpeed={scrollSpeed} />
      <EqualizerBars anchorX={RIGHT_VASE_B.x} anchorZ={RIGHT_VASE_B.z} opacity={opacity} scrollSpeed={scrollSpeed} />

      {AMBIENT.map((ring, i) => (
        <mesh key={i} position={[ring.x, ring.y, ring.z]} rotation={[ring.rotX, ring.rotY, 0]}>
          <torusGeometry args={[ring.r, 0.006, 6, 28]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.22} />
        </mesh>
      ))}

      <mesh ref={headRef}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.9} />
      </mesh>

      <FloatingDebris specs={DEBRIS} color={color} opacity={opacity} paused={paused} shape="octahedron" />
    </group>
  );
}
