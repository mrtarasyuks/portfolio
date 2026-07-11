"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/ThemeContext";
import { ABOUT_VIDEO_SRC_DARK, ABOUT_VIDEO_SRC_LIGHT } from "@/content/assetPaths";

const PLAY_DELAY_MS = 1000;

/**
 * Sizing is fully caller-controlled via `className` (no hardcoded h-/w- here) — the about page
 * constrains this to a real 9:16 box so `object-cover` never crops the subject, which a
 * viewport-height-driven arbitrary box previously did. Starts playing 1s after mount (no autoplay
 * pop, no play/pause UI), stops naturally at the end (no loop). Source swaps with the light/dark
 * toggle since two graded versions of the clip were supplied.
 */
export function AboutVideoPanel({
  hasVideoDark,
  hasVideoLight,
  className,
}: {
  hasVideoDark: boolean;
  hasVideoLight: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();

  const hasVideo = hasVideoDark || hasVideoLight;
  const preferLight = theme === "light" && hasVideoLight;
  const preferDark = theme !== "light" && hasVideoDark;
  const src = preferLight ? ABOUT_VIDEO_SRC_LIGHT : preferDark ? ABOUT_VIDEO_SRC_DARK : hasVideoDark ? ABOUT_VIDEO_SRC_DARK : ABOUT_VIDEO_SRC_LIGHT;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    const timeout = setTimeout(() => {
      video.play().catch(() => {});
    }, PLAY_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [hasVideo, src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-bg shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] transition-all duration-700 ease-out",
        mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0",
        className
      )}
      style={{ transitionDelay: mounted ? "150ms" : "0ms" }}
    >
      {hasVideo && (
        <video ref={videoRef} key={src} className="h-full w-full object-cover" src={src} muted playsInline preload="auto" />
      )}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: "linear-gradient(to right, transparent, var(--glass-specular), transparent)" }}
      />
    </div>
  );
}
