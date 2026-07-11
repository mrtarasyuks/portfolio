import { ProjectVideo } from "@/components/work/ProjectVideo";
import type { PortfolioProject } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/** Groups video-kind media across all Video-world projects by ProjectMedia.category — empty/coming-soon until a project actually has video media, which none do yet. */
export function VideosByCategory({ projects, t }: { projects: PortfolioProject[]; t: CopyDict }) {
  const byCategory = new Map<string, { label: string; src: string }[]>();

  for (const project of projects) {
    for (const media of project.media ?? []) {
      if (media.kind !== "video" || !media.src) continue;
      const category = media.category ?? t.videoWorld.uncategorized;
      const list = byCategory.get(category) ?? [];
      list.push({ label: media.label, src: media.src });
      byCategory.set(category, list);
    }
  }

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.videoWorld.videosTitle}</h2>
      {byCategory.size > 0 ? (
        <div className="mt-4 space-y-10">
          {Array.from(byCategory.entries()).map(([category, videos]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-text">{category}</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {videos.map((video) => (
                  <ProjectVideo key={video.src} src={video.src} label={video.label} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">{t.videoWorld.videosComingSoon}</p>
      )}
    </div>
  );
}
