"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { FogExp2, Group } from "three";
import type { ProjectWorld, ThemeMode } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import { useLerpedColor } from "@/hooks/useLerpedColor";
import { ServerColumnField } from "@/components/scene/backdrops/ServerColumnField";
import { PrintRingField } from "@/components/scene/backdrops/PrintRingField";
import { FrameCardField } from "@/components/scene/backdrops/FrameCardField";

const FIELD_BY_WORLD = {
  developers: ServerColumnField,
  "3d": PrintRingField,
  video: FrameCardField,
} as const;

export const FADE_SECONDS = 0.6;
/** How far the outgoing/incoming backdrop swirls during the crossfade — a shared rotation sweep sells "the world turning past you" instead of a flat dissolve. */
const SWIRL_ANGLE = 0.5;

type Layer = { world: ProjectWorld; id: number; born: number; direction: "in" | "out" };

export function WorldBackdrop({
  world,
  paused,
  scrollSpeed = 0,
  theme: siteTheme = "dark",
}: {
  world: ProjectWorld;
  paused: boolean;
  scrollSpeed?: number;
  theme?: ThemeMode;
}) {
  const theme = getWorldTheme(world);
  const fogColor = useLerpedColor(theme.fog, 1.6);
  const fogRef = useRef<FogExp2>(null);
  const idRef = useRef(0);
  const [layers, setLayers] = useState<Layer[]>([{ world, id: 0, born: 0, direction: "in" }]);

  useEffect(() => {
    idRef.current += 1;
    const nextId = idRef.current;
    setLayers((prev) => [
      ...prev.map((l) => ({ ...l, direction: "out" as const, born: 0 })),
      { world, id: nextId, born: -1, direction: "in" as const },
    ]);
  }, [world]);

  useFrame(() => {
    if (fogRef.current) fogRef.current.color.copy(fogColor.current);
  });

  function handleFadeOutComplete(id: number) {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <group>
      <fogExp2 ref={fogRef} attach="fog" args={[theme.fog, 0.045]} />
      {layers.map((layer) => {
        const Field = FIELD_BY_WORLD[layer.world];
        const layerTheme = getWorldTheme(layer.world);
        return (
          <FadingField
            key={layer.id}
            direction={layer.direction}
            onFadeOutComplete={layer.direction === "out" ? () => handleFadeOutComplete(layer.id) : undefined}
          >
            {(opacity) => <Field color={layerTheme.signal} opacity={opacity} paused={paused} scrollSpeed={scrollSpeed} theme={siteTheme} />}
          </FadingField>
        );
      })}
    </group>
  );
}

function FadingField({
  direction,
  onFadeOutComplete,
  children,
}: {
  direction: "in" | "out";
  onFadeOutComplete?: () => void;
  children: (opacity: number) => React.ReactNode;
}) {
  const initial = direction === "in" ? 0 : 1;
  const opacityRef = useRef(initial);
  const [renderOpacity, setRenderOpacity] = useState(initial);
  const doneRef = useRef(false);
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const target = direction === "in" ? 1 : 0;
    opacityRef.current += (target - opacityRef.current) * Math.min(1, delta * (1 / FADE_SECONDS) * 3);
    if (Math.abs(opacityRef.current - target) < 0.01) opacityRef.current = target;
    setRenderOpacity(opacityRef.current);

    // "in" arrives pre-rotated and un-rotates into place; "out" continues rotating the same
    // way as it fades — together they read as one continuous swirl passing through, not a dissolve.
    const progress = 1 - opacityRef.current;
    if (groupRef.current) {
      const sign = direction === "in" ? 1 : -1;
      groupRef.current.rotation.y = sign * progress * SWIRL_ANGLE;
      groupRef.current.scale.setScalar(direction === "in" ? 1 - progress * 0.12 : 1 + progress * 0.12);
    }

    if (direction === "out" && opacityRef.current === 0 && !doneRef.current) {
      doneRef.current = true;
      onFadeOutComplete?.();
    }
  });

  return <group ref={groupRef}>{children(renderOpacity)}</group>;
}
