"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { WorldBackdrop } from "@/components/scene/WorldBackdrop";
import { Avatar } from "@/components/scene/Avatar";
import { CameraRig } from "@/components/scene/CameraRig";
import { BioCard } from "@/components/scene/BioCard";
import { ProjectSliderPanel } from "@/components/hero/ProjectSliderPanel";
import { useWorldNav } from "@/context/WorldNavContext";
import { useGridScroll } from "@/context/GridScrollContext";
import { useTheme } from "@/context/ThemeContext";
import { useMinWidth } from "@/hooks/useMinWidth";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { type Locale } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import type { CopyDict } from "@/content/copy";

export function HeroOrbitScene({
  locale,
  t,
  reducedMotion = false,
  hasPortrait,
  hasPhotoRight,
  hasPhotoBack,
  hasPhotoLeft,
  logoBySlug,
}: {
  locale: Locale;
  t: CopyDict;
  reducedMotion?: boolean;
  hasPortrait: boolean;
  hasPhotoRight: boolean;
  hasPhotoBack: boolean;
  hasPhotoLeft: boolean;
  logoBySlug: Record<string, boolean>;
}) {
  const { world, next, prev } = useWorldNav();
  const { on: gridScrollOn, speed: gridScrollSpeed } = useGridScroll();
  const { theme: siteTheme } = useTheme();
  const theme = getWorldTheme(world);
  // The bio card and project panel are fixed-size Html/DOM-overlay elements — they can't respond
  // to Tailwind breakpoints on their own 3D-anchored positioning, so they're skipped below md:
  // rather than rendering clipped/cramped.
  const showSidePanels = useMinWidth(768);

  const worldProjects = useMemo(() => projects.filter((p) => p.world === world), [world]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const worldVars = {
    "--w-bg": theme.bg,
    "--w-signal": theme.signal,
    "--w-text-dim": theme.textDim,
  } as React.CSSProperties;

  return (
    <section className="world-scope world-light-surface relative border-b border-line" data-world={world} style={worldVars}>
      {/* Name/role are visible on the bio card now — this stays for a11y/SEO (one real h1 per page) without duplicating them on screen. */}
      <h1 className="sr-only">
        {profile.name} — {t.hero.role}
      </h1>

      <div
        className="relative min-h-[560px] w-full overflow-hidden"
        style={{ marginTop: "calc(-1 * var(--header-h, 6rem))", height: "calc(86vh + var(--header-h, 6rem))" }}
      >
        <div className="letterbox-bar letterbox-bar-top pointer-events-none absolute inset-x-0 top-0 z-20" aria-hidden />
        <div className="letterbox-bar letterbox-bar-bottom pointer-events-none absolute inset-x-0 bottom-0 z-20" aria-hidden />
        <Canvas camera={{ position: [0, 0.2, 9.5], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[6, 4, 6]} intensity={1.1} color="#f5f3ed" />
          <CameraRig world={world} instant={reducedMotion} />
          <WorldBackdrop world={world} paused={reducedMotion} scrollSpeed={gridScrollOn ? gridScrollSpeed : 0} theme={siteTheme} />
          <Suspense fallback={null}>
            <Avatar paused={reducedMotion} signalColor={theme.signal} world={world} />
          </Suspense>
          {showSidePanels && (
            <BioCard
              t={t}
              locale={locale}
              color={theme.signal}
              hasPortrait={hasPortrait}
              hasPhotoRight={hasPhotoRight}
              hasPhotoBack={hasPhotoBack}
              hasPhotoLeft={hasPhotoLeft}
              reducedMotion={reducedMotion}
            />
          )}
        </Canvas>

        {showSidePanels && (
          <div className="pointer-events-none absolute inset-y-0 left-[74%] z-10 flex -translate-x-1/2 items-center">
            <ProjectSliderPanel projects={worldProjects} world={world} locale={locale} t={t} logoBySlug={logoBySlug} />
          </div>
        )}
      </div>
    </section>
  );
}
