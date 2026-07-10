"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

const COUNT = 26;

const POSITIONS = Array.from({ length: COUNT }, () => ({
  x: (Math.random() - 0.5) * 22,
  z: -4 - Math.random() * 14,
  y: (Math.random() - 0.5) * 6,
  h: 1.2 + Math.random() * 2.4,
}));

export function ServerColumnField({ color, opacity, paused }: { color: string; opacity: number; paused: boolean }) {
  const pulseRef = useRef<Mesh>(null);
  const pulseState = useRef({ col: 0, t: 0, next: 2 });

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
  });

  return (
    <group>
      {POSITIONS.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <cylinderGeometry args={[0.02, 0.02, pos.h, 6]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.35} />
        </mesh>
      ))}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.9} />
      </mesh>
    </group>
  );
}
