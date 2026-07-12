"use client";

import { useMemo } from "react";
import { Pedestal } from "@/components/scene/metaverse/Pedestal";
import { figurines } from "@/content/figurines";
import type { Locale } from "@/content/types";

const ROOM_WIDTH = 14;
const ROOM_DEPTH = 12;
const ROOM_HEIGHT = 6;
const WALL_COLOR = "#f6f4ee";
const FLOOR_COLOR = "#e9e6db";

/** Six plinths arranged along the back and side walls, gallery-style — a fixed layout independent
 * of how many figurines actually exist yet, so the room reads as a finished space today (empty
 * pedestals) and simply gains video plaques as `figurines.ts` gains entries, no layout work later. */
const SLOTS: [number, number, number][] = [
  [-4.4, 0, -4.6],
  [0, 0, -5.2],
  [4.4, 0, -4.6],
  [-5.8, 0, -0.5],
  [5.8, 0, -0.5],
  [0, 0, 2.6],
];

export function MetaverseRoom({ locale, paused }: { locale: Locale; paused: boolean }) {
  const slots = useMemo(() => SLOTS, []);

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 9, 5]} intensity={1.1} color="#fffaf0" castShadow />
      <directionalLight position={[-6, 5, -4]} intensity={0.35} color="#eaf2ff" />
      <pointLight position={[0, 4.4, 0]} intensity={0.4} color="#fffef8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.95} />
      </mesh>

      <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={1} />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={1} />
      </mesh>
      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={1} />
      </mesh>

      {slots.map((position, i) => (
        <Pedestal key={i} position={position} figurine={figurines[i]} locale={locale} paused={paused} />
      ))}
    </group>
  );
}
