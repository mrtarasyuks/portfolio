"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { Mesh } from "three";

export function SpaceBackground({ paused }: { paused: boolean }) {
  const planetRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (paused || !planetRef.current) return;
    planetRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group>
      <Stars radius={60} depth={40} count={2200} factor={2.4} saturation={0} fade speed={paused ? 0 : 0.4} />

      <mesh ref={planetRef} position={[5.5, -2.5, -9]}>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshStandardMaterial color="#1b1b1f" roughness={0.85} metalness={0.15} emissive="#2a2410" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[5.5, -2.5, -9]} rotation={[0.4, 0, 0.15]}>
        <torusGeometry args={[3.6, 0.02, 8, 96]} />
        <meshBasicMaterial color="#ffd21f" transparent opacity={0.35} />
      </mesh>

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 4, 6]} intensity={1.1} color="#f5f3ed" />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#ffd21f" />
    </group>
  );
}
