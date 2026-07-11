"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, Outlines, Float } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import { worlds, type ProjectWorld } from "@/content/types";

const MODEL_PATH = "/model/model-tarasiuk.glb";
const TARGET_HEIGHT = 3.6;
/** Three worlds sit on one circle — switching worlds turns the avatar exactly a third of the way around. */
const STEP_ANGLE = (Math.PI * 2) / 3;
const IDLE_SPEED = 0.18;
const DRAG_SENSITIVITY = 0.0075;
const VELOCITY_DECAY = 3.5;

useGLTF.setDecoderPath("/draco/");
useGLTF.preload(MODEL_PATH);

type SpinState = { value: number; target: number | null; velocity: number };

export function Avatar({
  paused,
  signalColor,
  world,
}: {
  paused: boolean;
  signalColor: string;
  world: ProjectWorld;
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const fitRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const spin = useRef<SpinState>({ value: 0, target: null, velocity: 0 });
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const prevWorldIndex = useRef(worlds.indexOf(world));

  useLayoutEffect(() => {
    const group = fitRef.current;
    if (!group) return;

    // Reset to identity first so this measurement is idempotent regardless of how many times
    // the effect runs (React Strict Mode double-invokes it in dev). That alone isn't enough:
    // Box3.setFromObject() always measures in WORLD space, and this group sits under Float's
    // bobbing wrapper and the idle-spin group — so the instant this effect happens to run
    // (which shifts around under Strict Mode / Suspense-retry timing) can catch Float mid-bob,
    // silently baking a real (not stale-cache) vertical offset into the measured box and
    // therefore into the computed floor position. Detaching from that animated ancestor chain
    // for the duration of the measurement makes the box reflect the model's own intrinsic
    // size only, independent of wherever its parents currently are.
    const parent = group.parent;
    if (parent) parent.remove(group);

    group.scale.setScalar(1);
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const scale = TARGET_HEIGHT / (size.y || 1);
    group.scale.setScalar(scale);
    group.updateMatrixWorld(true);

    const scaledBox = new Box3().setFromObject(group);
    const center = new Vector3();
    scaledBox.getCenter(center);
    group.position.x -= center.x;
    group.position.z -= center.z;
    group.position.y -= scaledBox.min.y;

    if (parent) parent.add(group);
  }, [scene]);

  // World switch → step the avatar+platform a third of the way around, in whichever
  // direction is the shorter circular hop between the old and new world.
  useEffect(() => {
    const nextIndex = worlds.indexOf(world);
    const prevIndex = prevWorldIndex.current;
    prevWorldIndex.current = nextIndex;
    if (nextIndex === prevIndex) return;

    const forwardDist = (nextIndex - prevIndex + worlds.length) % worlds.length;
    const direction = forwardDist === 1 ? 1 : -1;

    if (paused) {
      spin.current.value += direction * STEP_ANGLE;
      spin.current.target = null;
    } else {
      const base = spin.current.target ?? spin.current.value;
      spin.current.target = base + direction * STEP_ANGLE;
    }
  }, [world, paused]);

  const handleWindowPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const deltaX = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    const rotationDelta = deltaX * DRAG_SENSITIVITY;
    spin.current.value += rotationDelta;
    spin.current.velocity = rotationDelta;
  }, []);

  // pointerup/pointercancel are registered with { once: true } below, so they remove themselves —
  // this only needs to tear down the pointermove listener, which avoids the handler referencing itself.
  const handleWindowPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", handleWindowPointerMove);
  }, [handleWindowPointerMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [handleWindowPointerMove, handleWindowPointerUp]);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = true;
    spin.current.target = null;
    spin.current.velocity = 0;
    lastPointerX.current = e.nativeEvent.clientX;
    document.body.style.cursor = "grabbing";
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp, { once: true });
    window.addEventListener("pointercancel", handleWindowPointerUp, { once: true });
  }

  useFrame((_, delta) => {
    const state = spin.current;

    if (dragging.current) {
      // value/velocity already updated directly by the window pointermove handler
    } else if (state.target !== null) {
      const diff = state.target - state.value;
      if (Math.abs(diff) < 0.001) {
        state.value = state.target;
        state.target = null;
      } else {
        state.value += diff * Math.min(1, delta * 2.4);
      }
    } else {
      state.velocity *= Math.max(0, 1 - delta * VELOCITY_DECAY);
      if (Math.abs(state.velocity) < 0.0005) state.velocity = 0;
      state.value += state.velocity + (paused ? 0 : delta * IDLE_SPEED);
    }

    if (spinRef.current) spinRef.current.rotation.y = state.value;
  });

  return (
    <Float speed={paused ? 0 : 1.2} floatIntensity={paused ? 0 : 0.6} rotationIntensity={paused ? 0 : 0.15} position={[0, -1.55, 0]}>
      <group ref={spinRef}>
        <group ref={fitRef}>
          <primitive object={scene} />
          <Outlines thickness={2} color={signalColor} transparent opacity={0.55} screenspace />
        </group>
        <Platform color={signalColor} />
        <mesh
          position={[0, 1.68, 0]}
          onPointerDown={handlePointerDown}
          onPointerOver={() => {
            if (!dragging.current) document.body.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (!dragging.current) document.body.style.cursor = "";
          }}
        >
          <cylinderGeometry args={[1.56, 1.56, 4.08, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <pointLight position={[0, 1.44, 1.92]} intensity={0.9} color={signalColor} distance={6} />
      </group>
    </Float>
  );
}

function Platform({ color }: { color: string }) {
  const height = 0.17;
  return (
    <group position={[0, -height / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[1.22, 1.37, height, 48]} />
        <meshStandardMaterial color="#151518" roughness={0.35} metalness={0.45} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.22, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={2} />
      </mesh>
    </group>
  );
}
