"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Outlines, Float } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";

const MODEL_PATH = "/model/model-tarasiuk.glb";
const TARGET_HEIGHT = 3;

useGLTF.setDecoderPath("/draco/");
useGLTF.preload(MODEL_PATH);

export function Avatar({ paused, signalColor }: { paused: boolean; signalColor: string }) {
  const { scene } = useGLTF(MODEL_PATH);
  const fitRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);

  useLayoutEffect(() => {
    const group = fitRef.current;
    if (!group) return;

    // Reset to identity first so this measurement is idempotent regardless of
    // how many times the effect runs (React Strict Mode double-invokes it).
    group.scale.setScalar(1);
    group.position.set(0, 0, 0);

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const scale = TARGET_HEIGHT / (size.y || 1);
    group.scale.setScalar(scale);

    const scaledBox = new Box3().setFromObject(group);
    const center = new Vector3();
    scaledBox.getCenter(center);
    group.position.x -= center.x;
    group.position.z -= center.z;
    group.position.y -= scaledBox.min.y;
  }, [scene]);

  useFrame((_, delta) => {
    if (!paused && spinRef.current) spinRef.current.rotation.y += delta * 0.18;
  });

  return (
    <Float speed={paused ? 0 : 1.2} floatIntensity={paused ? 0 : 0.6} rotationIntensity={paused ? 0 : 0.15} position={[0, -1.35, 0]}>
      <group ref={spinRef}>
        <group ref={fitRef}>
          <primitive object={scene} />
          <Outlines thickness={2} color={signalColor} transparent opacity={0.55} screenspace />
        </group>
        <pointLight position={[0, 1.2, 1.6]} intensity={0.9} color={signalColor} distance={5} />
      </group>
    </Float>
  );
}
