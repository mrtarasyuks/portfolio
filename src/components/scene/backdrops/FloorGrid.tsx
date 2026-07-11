"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending } from "three";
import type { GridHelper, LineBasicMaterial } from "three";
import type { ThemeMode } from "@/content/types";

/** Black grid lines in light theme — the ask was "the same moving floor as dark theme, just
 * recolored," not a separate flat overlay, so this recolors the real scrolling GridHelper mesh
 * itself rather than drawing a second, static grid pattern behind the canvas. */
const LIGHT_THEME_LINE_COLOR = "#0a0a0b";

/**
 * Two faint duplicate grids, offset by a fraction of a cell and additively blended, fake a
 * thicker/brighter line. A real fatter `GridHelper` line isn't reliably possible — native WebGL
 * `linewidth` is ignored by ANGLE/most GPUs, and pulling in Line2/fat-lines machinery was already
 * rejected for the spotlight beam in an earlier pivot as too heavy for a decorative effect.
 */
const THICKNESS_JITTER = 0.035;
const THICKNESS_OPACITY_RATIO = 0.45;
const GLOW_OFFSETS: [number, number][] = [
  [THICKNESS_JITTER, THICKNESS_JITTER],
  [-THICKNESS_JITTER, -THICKNESS_JITTER],
];

/**
 * A faint grounding plane shared by all three worlds — gives their backdrops a floor instead of
 * reading as objects floating in a void. `scrollSpeed` (driven by the header's grid-scroll toggle)
 * continuously shifts the grid along Z, wrapped modulo one cell width so the reset is invisible —
 * the classic "infinite scrolling floor" trick, reading as the grid receding like a 90s/Tron floor.
 *
 * `theme` is threaded down as a plain prop from outside the Canvas (HeroOrbitScene reads
 * `useTheme()` itself) rather than called via `useTheme()` in here — same reason `world`/
 * `scrollSpeed`/`paused` are already threaded as props through this whole backdrop chain instead
 * of read via context hooks from inside Canvas descendants.
 */
export function FloorGrid({
  color,
  opacity,
  position,
  size = 24,
  divisions = 24,
  scrollSpeed = 0,
  theme = "dark",
}: {
  color: string;
  opacity: number;
  position: [number, number, number];
  size?: number;
  divisions?: number;
  scrollSpeed?: number;
  theme?: ThemeMode;
}) {
  const mainRef = useRef<GridHelper>(null);
  const glowRefs = useRef<(GridHelper | null)[]>([]);
  const offset = useRef(0);
  const cellSize = size / divisions;
  const lineColor = theme === "light" ? LIGHT_THEME_LINE_COLOR : color;
  // R3F recreates a `gridHelper` (disposing the old THREE.GridHelper and constructing a fresh one)
  // whenever its `args` array changes by value — the standard way to react to a toggle here, since
  // GridHelper bakes its line colors into a vertex-color buffer at construction time and can't have
  // them patched after the fact the way a material's `color` property can. All three grids below
  // share this same `args` reference so they recreate in sync.
  const args = useMemo<[number, number, string, string]>(
    () => [size, divisions, lineColor, lineColor],
    [size, divisions, lineColor]
  );

  useLayoutEffect(() => {
    const grid = mainRef.current;
    if (grid) {
      const material = (Array.isArray(grid.material) ? grid.material[0] : grid.material) as LineBasicMaterial;
      material.transparent = true;
      material.toneMapped = false;
      material.opacity = opacity;
    }
    glowRefs.current.forEach((glow) => {
      if (!glow) return;
      const material = (Array.isArray(glow.material) ? glow.material[0] : glow.material) as LineBasicMaterial;
      material.transparent = true;
      material.toneMapped = false;
      material.depthWrite = false;
      material.blending = AdditiveBlending;
      material.opacity = opacity * THICKNESS_OPACITY_RATIO;
    });
  }, [opacity, lineColor]);

  useFrame((_, delta) => {
    if (!scrollSpeed) return;
    offset.current = (offset.current + delta * scrollSpeed * 2) % cellSize;
    if (mainRef.current) mainRef.current.position.z = position[2] + offset.current;
    glowRefs.current.forEach((glow, i) => {
      if (!glow) return;
      glow.position.z = position[2] + offset.current + GLOW_OFFSETS[i][1];
    });
  });

  return (
    <>
      <gridHelper ref={mainRef} args={args} position={position} />
      {GLOW_OFFSETS.map(([dx, dz], i) => (
        <gridHelper
          key={i}
          ref={(el) => {
            glowRefs.current[i] = el;
          }}
          args={args}
          position={[position[0] + dx, position[1], position[2] + dz]}
        />
      ))}
    </>
  );
}
