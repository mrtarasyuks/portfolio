"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import type { Mesh, MeshBasicMaterial } from "three";
import type { ThemeMode } from "@/content/types";
import { FloorGrid } from "./FloorGrid";
import { GravityCubes, makeDebrisField } from "./FloatingDebris";

const COUNT = 26;
/** Rainbow cycle rate — how fast each line's hue rotates once grid-scroll is active. */
const HUE_RATE = 0.09;

const POSITIONS = Array.from({ length: COUNT }, () => ({
  x: (Math.random() - 0.5) * 22,
  z: -4 - Math.random() * 14,
  y: (Math.random() - 0.5) * 6,
  h: 1.2 + Math.random() * 2.4,
  /** Per-line phase offset so the lamp-fade reads as many independent lights, not one synced blink. */
  phase: Math.random() * Math.PI * 2,
}));

const DEBRIS = makeDebrisField(20, 22, 10, -3, 15);

export function ServerColumnField({
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
  const pulseRef = useRef<Mesh>(null);
  const pulseState = useRef({ col: 0, t: 0, next: 2 });
  const lineRefs = useRef<(Mesh | null)[]>([]);
  const clock = useRef(0);
  const baseColor = useRef(new Color(color));
  const tmpColor = useRef(new Color());

  useEffect(() => {
    baseColor.current.set(color);
  }, [color]);

  useFrame((_, delta) => {
    if (paused) return;
    const p = pulseState.current;
    p.t += delta;
    if (p.t > p.next) {
      p.t = 0;
      p.next = 2 + Math.random() * 3;
      p.col = Math.floor(Math.random() * COUNT);
    }
    if (pulseRef.current) {
      const col = POSITIONS[p.col];
      const travel = (p.t / p.next) * col.h - col.h / 2;
      pulseRef.current.position.set(col.x, travel, col.z);
      pulseRef.current.visible = p.t < p.next * 0.85;
    }

    // Grid-scroll on: the vertical "server rack" lines light up like lamps, each cycling through
    // its own rainbow hue (phase-offset per line) rather than a single shared color — reads as
    // many independent multicolor lamps, not a synced blink. The faster the grid scrolls, the
    // faster both the hue cycle and the brightness pulse.
    clock.current += delta;
    const active = scrollSpeed > 0;
    const rate = 1.1 + scrollSpeed * 2.6;
    lineRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const material = mesh.material as MeshBasicMaterial;
      if (active) {
        const wave = 0.5 + 0.5 * Math.sin(clock.current * rate + POSITIONS[i].phase);
        const hue = (clock.current * HUE_RATE * rate + POSITIONS[i].phase / (Math.PI * 2)) % 1;
        tmpColor.current.setHSL(hue < 0 ? hue + 1 : hue, 0.75, 0.58);
        material.color.copy(tmpColor.current);
        material.opacity = opacity * (0.3 + wave * 0.65);
      } else {
        material.color.copy(baseColor.current);
        material.opacity = opacity * 0.35;
      }
    });
  });

  return (
    <group>
      <FloorGrid color={color} opacity={opacity * 0.14} position={[0, -1.85, -5]} size={28} divisions={28} scrollSpeed={scrollSpeed} theme={theme} />
      {POSITIONS.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          position={[pos.x, pos.y, pos.z]}
        >
          <cylinderGeometry args={[0.02, 0.02, pos.h, 6]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.35} />
        </mesh>
      ))}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.9} />
      </mesh>
      <GravityCubes specs={DEBRIS} color={color} opacity={opacity} paused={paused} />
    </group>
  );
}
