"use client";

import { useState } from "react";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import type { CopyDict } from "@/content/copy";

/** Case-study inline video — same uniform thumbnail + fullscreen custom player as the Video
 * Creator gallery, so every video on the site opens the same way. */
export function ProjectVideo({ src, label, t }: { src: string; label?: string; t: CopyDict }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VideoCard src={src} label={label ?? ""} onOpen={() => setOpen(true)} />
      {open && <VideoLightbox src={src} label={label} onClose={() => setOpen(false)} t={t} />}
    </>
  );
}
