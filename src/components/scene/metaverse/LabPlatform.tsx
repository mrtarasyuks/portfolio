"use client";

import { Suspense, useMemo } from "react";
import { Stars, useGLTF } from "@react-three/drei";
import { labObjects } from "@/content/labObjects";
import { LabObject } from "@/components/scene/metaverse/LabObject";

const FLOOR_SIZE = 60;
const FLOOR_COLOR = "#5a4a37";
const ACCENT_LIGHT_COLOR = "#ff6a2c";

labObjects.forEach((data) => useGLTF.preload(data.src));

/**
 * The 3D Lab's open platform — a single large floor plane with no walls, a 360° starfield behind
 * it, and the real showcase `.glb` objects (`labObjects.ts`) scattered across it at their own
 * curated relative scale. Deliberately the opposite of the old gallery room this replaced: no
 * walls/pedestals/plaques, just the objects themselves sitting directly on the platform.
 */
export function LabPlatform({ paused }: { paused: boolean }) {
  const objects = useMemo(() => labObjects, []);

  return (
    <group>
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 12, 6]} intensity={1.15} color="#fef6ea" />
      <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#4a6cff" />
      <pointLight position={[0, 5, 0]} intensity={0.35} color={ACCENT_LIGHT_COLOR} distance={30} />

      <Stars radius={90} depth={50} count={4500} factor={4} saturation={0} fade speed={paused ? 0 : 0.4} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[FLOOR_SIZE / 2, 64]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.95} metalness={0} />
      </mesh>

      <Suspense fallback={null}>
        {objects.map((data) => (
          <LabObject key={data.slug} data={data} paused={paused} />
        ))}
      </Suspense>
    </group>
  );
}
