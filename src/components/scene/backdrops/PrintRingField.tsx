"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

const COUNT = 16;

const RINGS = Array.from({ length: COUNT }, () => ({
  x: (Math.random() - 0.5) * 14,
  y: (Math.random() - 0.5) * 8,
  z: -3 - Math.random() * 12,
  r: 0.4 + Math.random() * 1.1,
  rotX: Math.random() * Math.PI,
  rotY: Math.random() * Math.PI,
}));

export function PrintRingField({ color, opacity, paused }: { color: string; opacity: number; paused: boolean }) {
  const headRef = useRef<Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;
    t.current += delta * 0.25;
    const y = Math.sin(t.current) * 3.5;
    if (headRef.current) headRef.current.position.set(0, y, -6);
  });

  return (
    <group>
      {RINGS.map((ring, i) => (
        <mesh key={i} position={[ring.x, ring.y, ring.z]} rotation={[ring.rotX, ring.rotY, 0]}>
          <torusGeometry args={[ring.r, 0.006, 6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.4} />
        </mesh>
      ))}
      <mesh ref={headRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.7} side={2} />
      </mesh>
    </group>
  );
}
