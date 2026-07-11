"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import type { GridHelper, LineBasicMaterial } from "three";
import type { ThemeMode } from "@/content/types";

/** Black grid lines in light theme — the ask was "the same moving floor as dark theme, just
 * recolored," not a separate flat overlay, so this recolors the real scrolling GridHelper mesh
 * itself rather than drawing a second, static grid pattern behind the canvas. */
const LIGHT_THEME_LINE_COLOR = "#0a0a0b";

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
  const ref = useRef<GridHelper>(null);
  const offset = useRef(0);
  const cellSize = size / divisions;
  const lineColor = theme === "light" ? LIGHT_THEME_LINE_COLOR : color;
  // R3F recreates a `gridHelper` (disposing the old THREE.GridHelper and constructing a fresh one)
  // whenever its `args` array changes by value — the standard way to react to a toggle here, since
  // GridHelper bakes its line colors into a vertex-color buffer at construction time and can't have
  // them patched after the fact the way a material's `color` property can.
  const args = useMemo<[number, number, string, string]>(
    () => [size, divisions, lineColor, lineColor],
    [size, divisions, lineColor]
  );

  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const material = (Array.isArray(grid.material) ? grid.material[0] : grid.material) as LineBasicMaterial;
    material.transparent = true;
    material.toneMapped = false;
    material.opacity = opacity;
  }, [opacity, lineColor]);

  useFrame((_, delta) => {
    const grid = ref.current;
    if (!grid || !scrollSpeed) return;
    offset.current = (offset.current + delta * scrollSpeed * 2) % cellSize;
    grid.position.z = position[2] + offset.current;
  });

  return <gridHelper ref={ref} args={args} position={position} />;
}
