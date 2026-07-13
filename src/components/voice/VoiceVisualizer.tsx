"use client";

import { useEffect, useRef } from "react";
import { useMotionCapability } from "@/hooks/useWebglSupport";

/** A pulsing glow ring wrapping the avatar, driven by a ref (not React state) updated at
 * animation-frame rate — see `useAudioLevel`. Reacts to whichever stream the call is currently
 * listening to or speaking through; the parent swaps which level ref it passes in as the call
 * state changes. Absolutely positioned to sit behind whatever `children` (the avatar) is passed. */
export function VoiceVisualizer({
  levelRef,
  color,
  children,
}: {
  levelRef: React.RefObject<number>;
  color: string;
  children: React.ReactNode;
}) {
  const ringRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionCapability();

  useEffect(() => {
    if (reducedMotion) return;
    let raf: number;
    function tick() {
      const el = ringRef.current;
      if (el) {
        const level = levelRef.current;
        const pulse = Math.sin(Date.now() / 260) * 0.03;
        const scale = 1 + Math.max(0, Math.min(1, level)) * 0.22 + pulse;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = String(0.35 + Math.max(0, Math.min(1, level)) * 0.5);
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, [levelRef, reducedMotion]);

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute inset-[-14px] rounded-full blur-md"
        style={{
          boxShadow: `0 0 0 6px ${color}55, 0 0 40px 10px ${color}40`,
          opacity: reducedMotion ? 0.5 : 0.35,
        }}
      />
      {children}
    </div>
  );
}
