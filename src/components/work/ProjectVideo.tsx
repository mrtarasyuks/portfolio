import { mediaUrl } from "@/lib/media";

export function ProjectVideo({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const resolved = mediaUrl(src);
  if (!resolved) return null;

  return (
    <div className="border border-line bg-surface p-2">
      {label && <p className="mb-2 px-2 pt-1 font-mono text-[11px] uppercase tracking-wide text-text-dim">{label}</p>}
      <video
        controls
        preload="metadata"
        poster={poster ? mediaUrl(poster) : undefined}
        className="w-full"
        src={resolved}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
