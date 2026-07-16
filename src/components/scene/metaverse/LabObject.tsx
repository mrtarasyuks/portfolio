"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import type { LabObject as LabObjectData } from "@/content/labObjects";

/**
 * One showcase model on the 3D Lab platform. Same "measure, rescale, recenter" idiom the homepage
 * avatar (`Avatar.tsx`) already uses for its own single model — generalized here to a curated
 * `targetSize` per object instead of one fixed height, since these seven models are unrelated
 * source files at unrelated native scales. Detaches from its parent for the measurement itself for
 * the same reason `Avatar` does: `Box3.setFromObject` measures in world space, so measuring while
 * still attached to an already-positioned/animated ancestor would bake that offset into the result.
 */
export function LabObject({ data, paused }: { data: LabObjectData; paused: boolean }) {
  const { scene } = useGLTF(data.src);
  const fitRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);

  useLayoutEffect(() => {
    const group = fitRef.current;
    if (!group) return;

    const parent = group.parent;
    if (parent) parent.remove(group);

    group.scale.setScalar(1);
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = data.targetSize / maxDim;
    group.scale.setScalar(scale);
    group.updateMatrixWorld(true);

    const scaledBox = new Box3().setFromObject(group);
    const center = new Vector3();
    scaledBox.getCenter(center);
    group.position.x -= center.x;
    group.position.z -= center.z;
    group.position.y -= scaledBox.min.y;

    if (parent) parent.add(group);
  }, [scene, data.targetSize]);

  useFrame((_, delta) => {
    if (!paused && data.rotationSpeed && spinRef.current) {
      spinRef.current.rotation.y += delta * data.rotationSpeed;
    }
  });

  return (
    <group position={data.position}>
      <group ref={spinRef}>
        <group ref={fitRef} rotation={data.rotation}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}
