"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

const OBSIDIAN = "#151518";
const SIGNAL = "#ffd21f";

export function AbstractFigure({ paused }: { paused: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (paused || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.18;
  });

  return (
    <Float
      speed={paused ? 0 : 1.4}
      floatIntensity={paused ? 0 : 0.8}
      rotationIntensity={paused ? 0 : 0.25}
      position={[0, -0.75, 0]}
    >
      <group ref={groupRef}>
        {/* head */}
        <Figure position={[0, 1.55, 0]}>
          <icosahedronGeometry args={[0.42, 1]} />
        </Figure>

        {/* torso */}
        <Figure position={[0, 0.55, 0]}>
          <capsuleGeometry args={[0.34, 0.9, 6, 12]} />
        </Figure>

        {/* arms */}
        <Figure position={[-0.62, 0.65, 0]} rotation={[0, 0, 0.55]}>
          <capsuleGeometry args={[0.12, 0.75, 4, 8]} />
        </Figure>
        <Figure position={[0.62, 0.65, 0]} rotation={[0, 0, -0.55]}>
          <capsuleGeometry args={[0.12, 0.75, 4, 8]} />
        </Figure>

        {/* legs */}
        <Figure position={[-0.22, -0.55, 0]} rotation={[0, 0, 0.08]}>
          <capsuleGeometry args={[0.14, 0.85, 4, 8]} />
        </Figure>
        <Figure position={[0.22, -0.55, 0]} rotation={[0, 0, -0.08]}>
          <capsuleGeometry args={[0.14, 0.85, 4, 8]} />
        </Figure>

        <pointLight position={[0, 0.5, 1.4]} intensity={0.8} color={SIGNAL} distance={4} />
      </group>
    </Float>
  );
}

function Figure({
  children,
  position,
  rotation,
}: {
  children: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        {children}
        <meshStandardMaterial color={OBSIDIAN} roughness={0.4} metalness={0.3} emissive={SIGNAL} emissiveIntensity={0.05} />
      </mesh>
      <mesh scale={1.03}>
        {children}
        <meshBasicMaterial color={SIGNAL} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
