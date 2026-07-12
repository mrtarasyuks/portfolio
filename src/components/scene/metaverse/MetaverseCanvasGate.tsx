"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { MetaverseRoom } from "@/components/scene/metaverse/MetaverseRoom";
import { useMotionCapability } from "@/hooks/useWebglSupport";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const ROOM_BG = "#f4f2ec";

/**
 * Gated the same way `HeroSceneGate` gates the homepage canvas — a text fallback rather than a
 * blank/broken WebGL surface on unsupported browsers, and idle drift stops under
 * prefers-reduced-motion instead of just running faster/slower.
 */
export function MetaverseCanvasGate({ locale, t }: { locale: Locale; t: CopyDict }) {
  const { ready, webglSupported, reducedMotion } = useMotionCapability();

  if (!ready) return <div className="h-[70vh] min-h-[480px] w-full rounded-[3rem] border border-line bg-surface" />;

  if (!webglSupported) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[3rem] border border-line bg-surface p-10 text-center">
        <p className="max-w-sm text-sm text-text-muted">{t.metaverse.webglFallback}</p>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden rounded-[3rem] border border-line">
      <Canvas camera={{ position: [0, 2.6, 9.5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true }} shadows>
        <color attach="background" args={[ROOM_BG]} />
        <fog attach="fog" args={[ROOM_BG, 13, 24]} />
        <Suspense fallback={null}>
          <MetaverseRoom locale={locale} paused={reducedMotion} />
        </Suspense>
        <ContactShadows position={[0, 0.012, 0]} opacity={0.3} scale={16} blur={2.6} far={6} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={13}
          minPolarAngle={Math.PI * 0.16}
          maxPolarAngle={Math.PI * 0.5}
          target={[0, 1.5, 0]}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}
