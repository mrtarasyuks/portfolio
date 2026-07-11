import { createElement } from "react";
import { cn } from "@/lib/cn";

/** Shared "liquid glass" surface — translucent, blurred, soft specular top edge. Used identically wherever glass blocks appear (homepage project panel, /work index and gallery blocks) so they read as one consistent material, not several different glass effects. */
export function GlassPanel({
  children,
  className,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}) {
  return createElement(
    as,
    {
      className: cn(
        "relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-tint)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl",
        className
      ),
      style,
    },
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: "linear-gradient(to right, transparent, var(--glass-specular), transparent)" }}
      />
      {children}
    </>
  );
}
