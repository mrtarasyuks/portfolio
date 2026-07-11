"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/ui/VideoCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { videos, VIDEO_CATEGORIES, type VideoItem, type VideoCategory } from "@/content/videos";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

const PICK_COUNT = 3;

function pickRandom(list: VideoItem[], count: number): VideoItem[] {
  // Fisher-Yates on a copy — never mutates the shared `videos` array.
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Each genre is its own glass block — not a stacked list — showing 3 random clips from that
 * category (re-picked per page load). The random pick happens in a `useEffect` after mount, not
 * render body or a `useRef` initializer: this project's own established rule, since the React
 * Compiler's purity lint forbids `Math.random()` during render.
 *
 * The whole block is a `<Link>` into that category's own full-list page (`/work/video/[category]`)
 * — clips here autoplay muted on load as a preview and are NOT individually clickable/openable;
 * only the category page opens the fullscreen lightbox per clip. Each block glows constantly in the
 * world's signal `color`, the same always-on treatment `WorldTitleCube` uses for the page title.
 */
export function VideosByCategory({ t, locale, color }: { t: CopyDict; locale: Locale; color: string }) {
  const [picked, setPicked] = useState<Partial<Record<VideoCategory, VideoItem[]>>>({});

  useEffect(() => {
    // Deferred via rAF, not called synchronously in the effect body — same pattern this project
    // already uses (StaggerFadeIn, AnimatedName) to avoid the cascading-render lint rule.
    const id = requestAnimationFrame(() => {
      const byCategory = new Map<VideoCategory, VideoItem[]>();
      for (const video of videos) {
        const list = byCategory.get(video.category) ?? [];
        list.push(video);
        byCategory.set(video.category, list);
      }
      const next: Partial<Record<VideoCategory, VideoItem[]>> = {};
      for (const [category, list] of byCategory) {
        next[category] = pickRandom(list, PICK_COUNT);
      }
      setPicked(next);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const orderedCategories = VIDEO_CATEGORIES.filter((category) => (picked[category]?.length ?? 0) > 0);

  if (orderedCategories.length === 0) {
    return <p className="text-sm text-text-muted">{t.videoWorld.videosComingSoon}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2">
      {orderedCategories.map((category) => (
        <Link key={category} href={`/${locale}/work/video/${category}`} className="group relative block pt-5">
          {/* Notch-style title, straddling the card's top edge like an iPhone dynamic island —
              this outer wrapper (not GlassPanel, which clips via overflow-hidden) is what the
              notch is positioned against, so it isn't clipped by the card's own rounded corners. */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a0a0c] px-7 py-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)]">
            <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">
              {t.videoWorld.categories[category]}
            </h3>
          </div>

          <GlassPanel
            className="min-h-[220px] p-6 pt-11 transition-transform duration-300 group-hover:-translate-y-1"
            style={{
              borderColor: `${color}55`,
              boxShadow: `0 30px 80px -20px ${color}66, inset 0 0 40px -10px ${color}40`,
            }}
          >
            <div className="grid grid-cols-3 gap-3">
              {(picked[category] ?? []).map((video) => (
                <VideoCard key={video.src} src={video.src} label={video.label} autoPlay />
              ))}
            </div>
            <span
              className="mt-5 flex items-center justify-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide"
              style={{ color }}
            >
              {t.videoWorld.viewAll}
            </span>
          </GlassPanel>
        </Link>
      ))}
    </div>
  );
}
