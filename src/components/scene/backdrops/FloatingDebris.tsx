"use client";

import { useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export type DebrisSpec = { x: number; y: number; z: number; size: number; speed: number; rotX: number; rotY: number };

export function makeDebrisField(count: number, spreadX: number, spreadY: number, zMin: number, zRange: number): DebrisSpec[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * spreadX,
    y: (Math.random() - 0.5) * spreadY,
    z: zMin - Math.random() * zRange,
    size: 0.07 + Math.random() * 0.09,
    speed: 0.4 + Math.random() * 0.5,
    rotX: Math.random() * Math.PI,
    rotY: Math.random() * Math.PI,
  }));
}

/** Small volumetric shapes drifting through a backdrop — gives each world real depth/atmosphere beyond flat lines. */
export function FloatingDebris({
  specs,
  color,
  opacity,
  paused,
  shape,
}: {
  specs: DebrisSpec[];
  color: string;
  opacity: number;
  paused: boolean;
  shape: "box" | "octahedron" | "torus";
}) {
  return (
    <>
      {specs.map((d, i) => (
        <Float
          key={i}
          speed={paused ? 0 : d.speed}
          floatIntensity={paused ? 0 : 0.9}
          rotationIntensity={paused ? 0 : 0.5}
          position={[d.x, d.y, d.z]}
        >
          <mesh rotation={[d.rotX, d.rotY, 0]}>
            {shape === "box" && <boxGeometry args={[d.size, d.size, d.size]} />}
            {shape === "octahedron" && <octahedronGeometry args={[d.size, 0]} />}
            {shape === "torus" && <torusGeometry args={[d.size, d.size * 0.32, 6, 16]} />}
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.55} wireframe />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/**
 * Developers-world cubes: each one spins continuously on its own axis (real per-frame rotation,
 * not just drei Float's gentle wobble) while drifting through a slow sine-based "floating in
 * zero gravity" path — reuses the same DebrisSpec array (speed/rotX/rotY repurposed as rotation
 * speed and drift phase seeds) rather than a second randomized generator.
 */
export function GravityCubes({
  specs,
  color,
  opacity,
  paused,
}: {
  specs: DebrisSpec[];
  color: string;
  opacity: number;
  paused: boolean;
}) {
  const refs = useRef<(Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    specs.forEach((d, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.rotation.x += delta * (0.4 + d.speed);
      mesh.rotation.y += delta * (0.3 + d.speed * 0.8);
      mesh.position.y = d.y + Math.sin(t * d.speed * 0.6 + d.rotX) * 0.6;
      mesh.position.x = d.x + Math.cos(t * d.speed * 0.4 + d.rotY) * 0.4;
    });
  });

  return (
    <group>
      {specs.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[d.x, d.y, d.z]}
          rotation={[d.rotX, d.rotY, 0]}
        >
          <boxGeometry args={[d.size, d.size, d.size]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.55} wireframe />
        </mesh>
      ))}
    </group>
  );
}
