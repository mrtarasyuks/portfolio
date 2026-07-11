"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import type { CopyDict } from "@/content/copy";

export function ConnectBurstButton({
  t,
  color,
  size = "md",
}: {
  t: CopyDict;
  color: string;
  size?: "md" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const large = size === "lg";

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={
          large
            ? { backgroundColor: color, color: "#151300", boxShadow: `0 20px 50px -12px ${color}88` }
            : open
              ? { borderColor: color, color }
              : undefined
        }
        className={cn(
          "cursor-pointer rounded-full border font-mono uppercase tracking-wide shadow-[0_10px_30px_-8px_rgba(0,0,0,0.65)] transition-all active:scale-95",
          large
            ? "border-transparent px-8 py-4 text-sm font-semibold hover:brightness-110"
            : "border-line-strong bg-gradient-to-b from-surface-soft to-surface px-5 py-2.5 text-xs text-text"
        )}
      >
        {t.connect.cta}
      </button>

      <div aria-hidden={!open} className="flex flex-col items-center gap-2">
        <BurstLink href={profile.telegram} label={t.connect.telegram} open={open} delay={0} large={large} />
        <BurstLink href={`mailto:${profile.email}`} label={t.connect.email} open={open} delay={80} large={large} />
        <BurstLink href={profile.twitter} label={t.connect.twitter} open={open} delay={160} large={large} />
      </div>
    </div>
  );
}

function BurstLink({
  href,
  label,
  open,
  delay,
  large,
}: {
  href: string;
  label: string;
  open: boolean;
  delay: number;
  large: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      tabIndex={open ? 0 : -1}
      style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
      className={cn(
        "cursor-pointer rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface font-mono uppercase tracking-wide text-text-muted shadow-sm transition-all duration-300 hover:text-text active:scale-95",
        large ? "px-6 py-2.5 text-xs" : "px-4 py-1.5 text-[11px]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      )}
    >
      {label}
    </a>
  );
}
