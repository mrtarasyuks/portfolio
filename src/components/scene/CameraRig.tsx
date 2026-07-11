"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import type { ProjectWorld } from "@/content/types";

type Station = { position: [number, number, number]; fov: number; lookAt: [number, number, number] };

/** One camera "station" per world — switching worlds arcs the camera between these rather than cutting. */
const STATIONS: Record<ProjectWorld, Station> = {
  developers: { position: [0, 0.2, 9.5], fov: 42, lookAt: [0, -0.1, 0] },
  "3d": { position: [1.15, 1.05, 9.6], fov: 41, lookAt: [0, -0.55, 0] },
  video: { position: [-1.05, 0.05, 10.6], fov: 46, lookAt: [0, -0.05, 0] },
};

export function CameraRig({ world, instant }: { world: ProjectWorld; instant: boolean }) {
  // R3F's own default camera (from the `camera` prop on <Canvas>) is adopted into a ref we own —
  // mutating .current here, rather than the useThree() value directly, avoids relying on drei's
  // <PerspectiveCamera makeDefault> ref-forwarding, which is fragile under Strict Mode's dev-only
  // double-effect-invoke (it can leave the previous/default camera active instead of this one).
  const liveCamera = useThree((state) => state.camera);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const lookAt = useRef<[number, number, number]>([...STATIONS[world].lookAt]);

  useEffect(() => {
    cameraRef.current = liveCamera as PerspectiveCamera;
  }, [liveCamera]);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!instant || !camera) return;
    const station = STATIONS[world];
    camera.position.set(...station.position);
    camera.fov = station.fov;
    camera.updateProjectionMatrix();
    lookAt.current = [...station.lookAt];
    camera.lookAt(...station.lookAt);
  }, [world, instant]);

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (instant || !camera) return;
    const station = STATIONS[world];
    const k = Math.min(1, delta * 2.2);

    camera.position.x += (station.position[0] - camera.position.x) * k;
    camera.position.y += (station.position[1] - camera.position.y) * k;
    camera.position.z += (station.position[2] - camera.position.z) * k;

    camera.fov += (station.fov - camera.fov) * k;
    camera.updateProjectionMatrix();

    const [lx, ly, lz] = lookAt.current;
    const [tx, ty, tz] = station.lookAt;
    const next: [number, number, number] = [lx + (tx - lx) * k, ly + (ty - ly) * k, lz + (tz - lz) * k];
    lookAt.current = next;
    camera.lookAt(...next);
  });

  return null;
}
