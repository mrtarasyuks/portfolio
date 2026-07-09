"use client";

import { useSyncExternalStore } from "react";

export type MotionCapability = {
  ready: boolean;
  webglSupported: boolean;
  reducedMotion: boolean;
};

let cachedWebglSupport: boolean | null = null;

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function getWebglSnapshot(): boolean {
  if (cachedWebglSupport === null) cachedWebglSupport = detectWebgl();
  return cachedWebglSupport;
}

const noopSubscribe = () => () => {};

function useReady(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function useWebglSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, getWebglSnapshot, () => false);
}

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function useMotionCapability(): MotionCapability {
  const ready = useReady();
  const webglSupported = useWebglSupported();
  const reducedMotion = useReducedMotion();
  return { ready, webglSupported, reducedMotion };
}
