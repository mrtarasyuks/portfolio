"use client";

import { useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { videos, type VideoItem } from "@/content/videos";
import type { CopyDict } from "@/content/copy";

/** /work/ai-creator's content — the same portfolio reel as Video Creator, filtered to clips
 * tagged `aiMade` (see VideoItem.aiMade doc comment on the tagging caveat), one flat uniform grid
 * rather than grouped by genre. */
export function AiCreatorVideoGrid({ t }: { t: CopyDict }) {
  const [open, setOpen] = useState<VideoItem | null>(null);
  const aiVideos = videos.filter((v) => v.aiMade);

  if (aiVideos.length === 0) {
    return (
      <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {aiVideos.map((video) => (
          <VideoCard key={video.src} src={video.src} label={video.label} onOpen={() => setOpen(video)} />
        ))}
      </div>
      {open && <VideoLightbox src={open.src} label={open.label} onClose={() => setOpen(null)} t={t} />}
    </>
  );
}
