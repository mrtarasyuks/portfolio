import type { ProjectStatus } from "@/content/types";
import type { CopyDict } from "@/content/copy";
import { cn } from "@/lib/cn";

export function ProjectStatusBadge({
  status,
  labels,
  className,
  style,
}: {
  status: ProjectStatus;
  labels: CopyDict["status"];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim",
        className
      )}
      style={style}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", status === "shipped" || status === "in-testing" ? "bg-signal" : "bg-line-strong")}
        aria-hidden
      />
      {labels[status]}
    </span>
  );
}
