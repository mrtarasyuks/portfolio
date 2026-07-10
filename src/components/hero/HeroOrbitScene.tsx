"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { WorldBackdrop } from "@/components/scene/WorldBackdrop";
import { Avatar } from "@/components/scene/Avatar";
import { AbstractFigure } from "@/components/scene/AbstractFigure";
import { OrbitRing, type OrbitItem } from "@/components/scene/OrbitRing";
import { OrbitProjectCard, OrbitComingSoonCard } from "@/components/scene/OrbitProjectCard";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { worlds, type Locale, type ProjectWorld } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import type { CopyDict } from "@/content/copy";
import { cn } from "@/lib/cn";

export function HeroOrbitScene({
  locale,
  t,
  reducedMotion = false,
}: {
  locale: Locale;
  t: CopyDict;
  reducedMotion?: boolean;
}) {
  const [world, setWorld] = useState<ProjectWorld>("developers");
  const [activeIndex, setActiveIndex] = useState(0);
  const controlsRef = useRef<{ next: () => void; prev: () => void } | null>(null);
  const theme = getWorldTheme(world);

  const items: OrbitItem[] = useMemo(() => {
    const worldProjects = projects.filter((p) => p.world === world);
    const cards: OrbitItem[] = worldProjects.map((project) => ({
      key: project.slug,
      render: () => <OrbitProjectCard project={project} locale={locale} t={t} />,
    }));
    const ghostSlots = Math.max(0, 3 - cards.length);
    for (let i = 0; i < ghostSlots; i++) {
      cards.push({
        key: `${world}-ghost-${i}`,
        render: () => <OrbitComingSoonCard label={t.orbit.comingSoon} world={world} />,
      });
    }
    return cards;
  }, [world, locale, t]);

  function selectWorld(next: ProjectWorld) {
    setWorld(next);
    setActiveIndex(0);
  }

  const handleRegisterControls = useCallback((c: { next: () => void; prev: () => void }) => {
    controlsRef.current = c;
  }, []);

  const worldVars = {
    "--w-bg": theme.bg,
    "--w-signal": theme.signal,
    "--w-text-dim": theme.textDim,
  } as React.CSSProperties;

  return (
    <section className="world-scope relative border-b border-line" style={worldVars}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[var(--grid-margin)] pt-8 font-mono text-xs uppercase tracking-wide text-text-dim">
        <span>{t.hero.eyebrow}</span>
        <span>{profile.location}</span>
      </div>

      <div className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0.2, 9.5], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[6, 4, 6]} intensity={1.1} color="#f5f3ed" />
          <WorldBackdrop world={world} paused={reducedMotion} />
          <Suspense fallback={<AbstractFigure paused={reducedMotion} />}>
            <Avatar paused={reducedMotion} signalColor={theme.signal} />
          </Suspense>
          <OrbitRing
            items={items}
            paused={reducedMotion}
            radius={3.3}
            centerY={-1.35}
            onActiveChange={setActiveIndex}
            registerControls={handleRegisterControls}
          />
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 top-[6%] z-10 flex flex-col items-center gap-3 px-4">
          <div className="pointer-events-auto flex items-center gap-4 sm:gap-8">
            <NavButton direction="prev" label={t.orbit.prevLabel} onClick={() => controlsRef.current?.prev()} />
            <h1
              className={cn(
                "animate-float-name font-mono text-lg font-medium uppercase tracking-[0.2em] text-text drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]",
                "sm:text-xl md:text-2xl"
              )}
            >
              {profile.name}
            </h1>
            <NavButton direction="next" label={t.orbit.nextLabel} onClick={() => controlsRef.current?.next()} />
          </div>

          <div className="text-center">
            <p className="world-role font-mono text-sm uppercase tracking-wide">{t.hero.role}</p>
            <p className="mt-1 font-mono text-[11px] text-text-dim">
              {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-line py-8">
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label={t.orbit.switchWorld}>
          {worlds.map((w) => (
            <button
              key={w}
              type="button"
              role="tab"
              aria-selected={w === world}
              onClick={() => selectWorld(w)}
              className={cn(
                "world-tab border px-4 py-2 font-mono text-xs uppercase tracking-wide",
                w !== world && "border-line-strong text-text-muted hover:border-text-muted hover:text-text"
              )}
            >
              {t.orbit.worlds[w]}
            </button>
          ))}
        </div>
        <p className="world-tagline max-w-sm text-center text-xs">{t.orbit.worldTagline[world]}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 border-t border-line py-6">
        <Link
          href={`/${locale}/work`}
          className="world-cta group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text"
        >
          <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
          {t.hero.ctaPrimary}
        </Link>
        <CopyEmailButton label={t.hero.ctaSecondary} copiedLabel={t.hero.emailCopied} />
      </div>
    </section>
  );
}

function NavButton({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="world-nav-btn flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-bg/60 text-text backdrop-blur-sm sm:h-16 sm:w-16"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        {direction === "prev" ? (
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" />
        ) : (
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
    </button>
  );
}
