"use client";

import { Html } from "@react-three/drei";
import { mediaUrl } from "@/lib/media";
import type { Figurine } from "@/content/figurines";
import type { Locale } from "@/content/types";

const PEDESTAL_HEIGHT = 1.1;
const PEDESTAL_RADIUS = 0.5;

/**
 * A plinth on the metaverse room's floor — undecorated when it has no figurine (the room ships
 * with these empty on purpose, see `figurines.ts`), otherwise carries that figurine's own 360°
 * turntable loop as a billboarded video plaque floating just above it. Same `Html` + `distanceFactor`
 * idiom `BioCard` already uses (not `transform` mode) — billboards toward the camera instead of
 * being pinned to the pedestal's own rotation, which reads better for a small floating display.
 */
export function Pedestal({
  position,
  figurine,
  locale,
  paused,
}: {
  position: [number, number, number];
  figurine?: Figurine;
  locale: Locale;
  paused: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[0, PEDESTAL_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[PEDESTAL_RADIUS, PEDESTAL_RADIUS * 1.1, PEDESTAL_HEIGHT, 32]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.4} metalness={0.04} />
      </mesh>
      <mesh position={[0, PEDESTAL_HEIGHT + 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[PEDESTAL_RADIUS * 1.04, PEDESTAL_RADIUS * 1.04, 0.03, 32]} />
        <meshStandardMaterial color="#17161a" roughness={0.5} />
      </mesh>

      {figurine && (
        <Html position={[0, PEDESTAL_HEIGHT + 1.05, 0]} center distanceFactor={5.5} style={{ pointerEvents: "none" }}>
          <video
            src={mediaUrl(figurine.loopSrc)}
            autoPlay={!paused}
            muted
            loop
            playsInline
            aria-label={figurine.name[locale]}
            style={{ width: 170, height: 170, borderRadius: "9999px", objectFit: "cover", boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5)" }}
          />
        </Html>
      )}
    </group>
  );
}
