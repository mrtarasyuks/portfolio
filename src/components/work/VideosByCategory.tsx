"use client";

import { useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { videos, type VideoItem } from "@/content/videos";
import type { CopyDict } from "@/content/copy";

/** Most populated categories first. */
const CATEGORY_ORDER = ["viralVideo", "promo", "events", "interview", "realisticCinematic"] as const;

/** Groups the portfolio reel (`src/content/videos.ts`) by genre — every card is the same uniform,
 * cropped-thumbnail size regardless of the source clip's own orientation, and opens the shared
 * `VideoLightbox` fullscreen player on click instead of playing inline. */
export function VideosByCategory({ t }: { t: CopyDict }) {
  const [open, setOpen] = useState<VideoItem | null>(null);

  const byCategory = new Map<string, VideoItem[]>();
  for (const video of videos) {
    const list = byCategory.get(video.category) ?? [];
    list.push(video);
    byCategory.set(video.category, list);
  }
  const orderedCategories = CATEGORY_ORDER.filter((category) => byCategory.has(category));

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.videoWorld.videosTitle}</h2>
      {orderedCategories.length > 0 ? (
        <div className="mt-4 space-y-10">
          {orderedCategories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-text">{t.videoWorld.categories[category]}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {byCategory.get(category)!.map((video) => (
                  <VideoCard key={video.src} src={video.src} label={video.label} onOpen={() => setOpen(video)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">{t.videoWorld.videosComingSoon}</p>
      )}

      {open && <VideoLightbox src={open.src} label={open.label} onClose={() => setOpen(null)} t={t} />}
    </div>
  );
}
