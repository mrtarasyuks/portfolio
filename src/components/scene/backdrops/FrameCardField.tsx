"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";
import type { ThemeMode } from "@/content/types";
import { FloorGrid } from "./FloorGrid";
import { FallingDonuts } from "./FallingDonuts";

const COUNT = 14;
const DEPTH_STEPS = 7;
const TRACK_WIDTH = 3.2;
const TICK_COUNT = 9;

/** Frames arranged as a receding, converging corridor — a light-table/storyboard wall, not scattered noise. */
const FRAMES = Array.from({ length: COUNT }, (_, i) => {
  const w = 0.85 + Math.random() * 0.5;
  const step = i % DEPTH_STEPS;
  const side = i % 2 === 0 ? -1 : 1;
  const converge = 1 - step / DEPTH_STEPS;
  return {
    x: side * (5.2 + Math.random() * 2.4) * converge,
    y: (Math.random() - 0.5) * 3.4,
    z: -3 - step * 2.1,
    w,
    h: (w * 9) / 16,
    rot: side * (0.18 + Math.random() * 0.14),
    floatSpeed: 0.35 + Math.random() * 0.4,
  };
});

const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => (i / (TICK_COUNT - 1) - 0.5) * TRACK_WIDTH * 2);

export function FrameCardField({
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
  const playheadRef = useRef<Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;
    t.current += delta * 0.3;
    if (playheadRef.current) playheadRef.current.position.x = Math.sin(t.current) * TRACK_WIDTH;
  });

  return (
    <group>
      <FloorGrid color={color} opacity={opacity * 0.22} position={[0, -1.85, -4]} size={24} divisions={24} scrollSpeed={scrollSpeed} theme={theme} />

      {FRAMES.map((f, i) => (
        <Float
          key={i}
          speed={paused ? 0 : f.floatSpeed}
          floatIntensity={paused ? 0 : 0.7}
          rotationIntensity={paused ? 0 : 0.2}
          position={[f.x, f.y, f.z]}
        >
          <mesh rotation={[0, 0, f.rot]}>
            <planeGeometry args={[f.w, f.h]} />
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.22} wireframe />
          </mesh>
        </Float>
      ))}

      {/* scrubber/playhead track at the platform's feet, tying the video motif directly to the shared avatar */}
      <mesh position={[0, -1.34, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_WIDTH * 2 + 0.6, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.35} side={2} />
      </mesh>
      {TICKS.map((x, i) => (
        <mesh key={i} position={[x, -1.34, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.015, 0.12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.45} side={2} />
        </mesh>
      ))}
      <mesh ref={playheadRef} position={[0, -1.3, 1.4]}>
        <boxGeometry args={[0.03, 0.22, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.85} />
      </mesh>

      <FallingDonuts color={color} opacity={opacity} paused={paused} scrollSpeed={scrollSpeed} />
    </group>
  );
}
