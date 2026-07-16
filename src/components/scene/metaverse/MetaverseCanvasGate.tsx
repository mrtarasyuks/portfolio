"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LabPlatform } from "@/components/scene/metaverse/LabPlatform";
import { useMotionCapability } from "@/hooks/useWebglSupport";
import type { CopyDict } from "@/content/copy";

const SCENE_BG = "#050814";

/**
 * Gated the same way `HeroSceneGate` gates the homepage canvas — a text fallback rather than a
 * blank/broken WebGL surface on unsupported browsers, and idle drift (stars, spinning objects)
 * stops under prefers-reduced-motion instead of just running faster/slower. Fills its parent
 * completely (no fixed aspect box) — the page around it is the fullscreen shell.
 */
export function MetaverseCanvasGate({ t }: { t: CopyDict }) {
  const { ready, webglSupported, reducedMotion } = useMotionCapability();

  if (!ready) return <div className="h-full w-full bg-[#050814]" />;

  if (!webglSupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#050814] p-10 text-center">
        <p className="max-w-sm text-sm text-white/70">{t.metaverse.webglFallback}</p>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 13, 17], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 20, 85]} />
      <LabPlatform paused={reducedMotion} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        minDistance={5}
        maxDistance={40}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.47}
        target={[0, 0, 0]}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.15}
      />
    </Canvas>
  );
}
