"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

const COUNT = 14;

const FRAMES = Array.from({ length: COUNT }, () => {
  const w = 0.9 + Math.random() * 0.6;
  return {
    x: (Math.random() - 0.5) * 18,
    y: (Math.random() - 0.5) * 7,
    z: -3 - Math.random() * 13,
    w,
    h: (w * 9) / 16,
    rot: (Math.random() - 0.5) * 0.4,
  };
});

export function FrameCardField({ color, opacity, paused }: { color: string; opacity: number; paused: boolean }) {
  const scrubRef = useRef<Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;
    t.current += delta * 0.18;
    if (scrubRef.current) scrubRef.current.position.x = Math.sin(t.current) * 9;
  });

  return (
    <group>
      {FRAMES.map((f, i) => (
        <mesh key={i} position={[f.x, f.y, f.z]} rotation={[0, 0, f.rot]}>
          <planeGeometry args={[f.w, f.h]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.22} wireframe />
        </mesh>
      ))}
      <mesh ref={scrubRef} position={[0, 0, -5]}>
        <planeGeometry args={[0.02, 6]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.6} />
      </mesh>
    </group>
  );
}
