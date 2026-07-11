"use client";

import { useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { videos, type VideoItem, type VideoCategory } from "@/content/videos";
import type { CopyDict } from "@/content/copy";

/** A single category's full clip list (unlike the overview's 3-per-category preview) — every card
 * here is clickable and opens the fullscreen lightbox, since this is the "specific category" view
 * the Video Creator overview blocks link into. */
export function VideoCategoryGrid({ category, t }: { category: VideoCategory; t: CopyDict }) {
  const [open, setOpen] = useState<VideoItem | null>(null);
  const categoryVideos = videos.filter((v) => v.category === category);

  if (categoryVideos.length === 0) {
    return (
      <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categoryVideos.map((video) => (
          <VideoCard key={video.src} src={video.src} label={video.label} onOpen={() => setOpen(video)} />
        ))}
      </div>
      {open && <VideoLightbox src={open.src} label={open.label} onClose={() => setOpen(null)} t={t} />}
    </>
  );
}
