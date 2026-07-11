"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

const COUNT = 36;
const SPREAD_X = 22;
const SPREAD_Z_MIN = -3;
const SPREAD_Z_RANGE = 16;
const TOP_Y = 9;
const FLOOR_Y = -6;
const RANGE_Y = TOP_Y - FLOOR_Y;

type DonutSpec = {
  x: number;
  z: number;
  size: number;
  rotSpeedX: number;
  rotSpeedY: number;
  fallSpeed: number;
  startY: number;
};

/** Video world's "donuts" — wireframe tori that spin continuously on their own axis and fall
 * infinitely top-to-bottom (wrapping once past the floor), each at its own randomized baseline
 * speed. Grid-scroll being on adds a shared speed boost proportional to its slider value, same
 * "activate this world's motion" language as the Developers lamp-fade / 3D equalizer vases. */
const DONUTS: DonutSpec[] = Array.from({ length: COUNT }, () => ({
  x: (Math.random() - 0.5) * SPREAD_X,
  z: SPREAD_Z_MIN - Math.random() * SPREAD_Z_RANGE,
  size: 0.07 + Math.random() * 0.1,
  rotSpeedX: 0.3 + Math.random() * 0.9,
  rotSpeedY: 0.2 + Math.random() * 0.7,
  fallSpeed: 0.15 + Math.random() * 0.35,
  startY: TOP_Y - Math.random() * RANGE_Y,
}));

export function FallingDonuts({
  color,
  opacity,
  paused,
  scrollSpeed = 0,
}: {
  color: string;
  opacity: number;
  paused: boolean;
  scrollSpeed?: number;
}) {
  const refs = useRef<(Mesh | null)[]>([]);
  const y = useRef<number[]>(DONUTS.map((d) => d.startY));

  useFrame((_, delta) => {
    if (paused) return;
    const boost = scrollSpeed * 1.6;
    DONUTS.forEach((d, i) => {
      y.current[i] -= delta * (d.fallSpeed + boost);
      if (y.current[i] < FLOOR_Y) y.current[i] += RANGE_Y;

      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.y = y.current[i];
      mesh.rotation.x += delta * d.rotSpeedX;
      mesh.rotation.y += delta * d.rotSpeedY;
    });
  });

  return (
    <group>
      {DONUTS.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[d.x, d.startY, d.z]}
        >
          <torusGeometry args={[d.size, d.size * 0.35, 8, 20]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.55} wireframe />
        </mesh>
      ))}
    </group>
  );
}
