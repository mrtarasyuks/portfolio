import { VideoCard } from "@/components/ui/VideoCard";
import type { Figurine } from "@/content/figurines";
import type { Locale } from "@/content/types";

/** A figurine's looping turntable clip, reusing `VideoCard` (autoplaying, clickable to open the
 * detail modal) with a small blurred shadow beneath standing in for a display stand/pedestal. */
export function FigurineCard({ figurine, locale, onOpen }: { figurine: Figurine; locale: Locale; onOpen: () => void }) {
  return (
    <div className="relative pb-3">
      <VideoCard src={figurine.loopSrc} label={figurine.name[locale]} autoPlay onOpen={onOpen} />
      <div aria-hidden className="absolute inset-x-6 bottom-0 h-3 rounded-full bg-black/60 blur-md" />
    </div>
  );
}
