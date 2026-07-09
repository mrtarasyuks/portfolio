"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import { cn } from "@/lib/cn";

export type OrbitItem = {
  key: string;
  render: () => React.ReactNode;
};

type RotationState = { value: number; target: number | null };

export function OrbitRing({
  items,
  paused,
  radius = 4.2,
  centerY = -2.6,
  onActiveChange,
  registerControls,
}: {
  items: OrbitItem[];
  paused: boolean;
  radius?: number;
  centerY?: number;
  onActiveChange?: (index: number) => void;
  registerControls?: (controls: { next: () => void; prev: () => void }) => void;
}) {
  const rotation = useRef<RotationState>({ value: 0, target: null });
  const lastActive = useRef<number>(0);
  const count = items.length;
  const anglePerItem = (Math.PI * 2) / Math.max(count, 1);

  const controls = useMemo(
    () => ({
      next: () => {
        const base = rotation.current.target ?? rotation.current.value;
        rotation.current.target = base - anglePerItem;
      },
      prev: () => {
        const base = rotation.current.target ?? rotation.current.value;
        rotation.current.target = base + anglePerItem;
      },
    }),
    [anglePerItem]
  );

  useEffect(() => {
    registerControls?.(controls);
  }, [controls, registerControls]);

  useFrame((_, delta) => {
    const state = rotation.current;
    if (state.target !== null) {
      const diff = state.target - state.value;
      if (Math.abs(diff) < 0.001) {
        state.value = state.target;
        state.target = null;
      } else {
        state.value += diff * Math.min(1, delta * 5);
      }
    } else if (!paused) {
      state.value -= delta * 0.12;
    }

    if (count > 0) {
      const raw = Math.round(-state.value / anglePerItem) % count;
      const active = ((raw % count) + count) % count;
      if (active !== lastActive.current) {
        lastActive.current = active;
        onActiveChange?.(active);
      }
    }
  });

  return (
    <group>
      {items.map((item, i) => (
        <OrbitCard key={item.key} index={i} count={count} radius={radius} centerY={centerY} rotation={rotation}>
          {item.render()}
        </OrbitCard>
      ))}
    </group>
  );
}

function OrbitCard({
  index,
  count,
  radius,
  centerY,
  rotation,
  children,
}: {
  index: number;
  count: number;
  radius: number;
  centerY: number;
  rotation: React.RefObject<RotationState>;
  children: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef<number | null>(null);

  useFrame((state) => {
    if (mountedAt.current === null) mountedAt.current = state.clock.elapsedTime;
    const anglePerItem = (Math.PI * 2) / Math.max(count, 1);
    const angle = index * anglePerItem + rotation.current.value;
    const x = radius * Math.sin(angle);
    const z = radius * Math.cos(angle);
    groupRef.current?.position.set(x, centerY, z);

    const depth = (Math.cos(angle) + 1) / 2;
    const entrance = Math.min(1, (state.clock.elapsedTime - mountedAt.current) / 0.6);
    if (htmlRef.current) {
      htmlRef.current.style.opacity = String((0.2 + depth * 0.75) * entrance);
      htmlRef.current.style.transform = `scale(${0.6 + depth * 0.3})`;
      htmlRef.current.style.zIndex = String(Math.round(depth * 100));
      htmlRef.current.style.pointerEvents = depth > 0.55 ? "auto" : "none";
    }
  });

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={8} zIndexRange={[0, 100]} style={{ pointerEvents: "none" }}>
        <div ref={htmlRef} className={cn("transition-none")}>
          {children}
        </div>
      </Html>
    </group>
  );
}
