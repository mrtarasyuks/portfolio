import { videoTools } from "@/content/tools";
import type { CopyDict } from "@/content/copy";

/** Video-world-only "programs I use" list — data-driven off src/content/tools.ts, currently empty on purpose (real names/logos land later as a one-object addition, without touching this component). */
export function ToolsUsed({ t }: { t: CopyDict }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.videoWorld.toolsTitle}</h2>
      {videoTools.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {videoTools.map((tool) => (
            <span
              key={tool.name}
              className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-text-muted"
            >
              {tool.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">{t.videoWorld.toolsComingSoon}</p>
      )}
    </div>
  );
}
