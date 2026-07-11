"use client";

import { useEffect, useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { videos, type VideoItem, type VideoCategory } from "@/content/videos";
import type { CopyDict } from "@/content/copy";

/** Most populated categories first. */
const CATEGORY_ORDER: VideoCategory[] = ["viralVideo", "promo", "events", "interview", "realisticCinematic"];
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
 */
export function VideosByCategory({ t }: { t: CopyDict }) {
  const [open, setOpen] = useState<VideoItem | null>(null);
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

  const orderedCategories = CATEGORY_ORDER.filter((category) => (picked[category]?.length ?? 0) > 0);

  if (orderedCategories.length === 0) {
    return <p className="text-sm text-text-muted">{t.videoWorld.videosComingSoon}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2">
      {orderedCategories.map((category) => (
        <div key={category} className="relative pt-5">
          {/* Notch-style title, straddling the card's top edge like an iPhone dynamic island —
              this outer wrapper (not GlassPanel, which clips via overflow-hidden) is what the
              notch is positioned against, so it isn't clipped by the card's own rounded corners. */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0a0a0c] px-7 py-2.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)]">
            <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">
              {t.videoWorld.categories[category]}
            </h3>
          </div>

          <GlassPanel className="p-5 pt-9">
            <div className="grid grid-cols-3 gap-2">
              {(picked[category] ?? []).map((video) => (
                <VideoCard key={video.src} src={video.src} label={video.label} onOpen={() => setOpen(video)} />
              ))}
            </div>
          </GlassPanel>
        </div>
      ))}

      {open && <VideoLightbox src={open.src} label={open.label} onClose={() => setOpen(null)} t={t} />}
    </div>
  );
}
