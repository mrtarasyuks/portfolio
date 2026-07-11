"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import type { CopyDict } from "@/content/copy";

/** The header's "Connect" pill — pops its own Telegram/Email/Twitter links open instead of navigating to a separate page. */
export function HeaderConnectButton({ t }: { t: CopyDict }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "cursor-pointer rounded-full border bg-gradient-to-b from-surface-soft to-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wide shadow-sm transition-all active:scale-95",
          open ? "border-signal text-signal" : "border-line-strong text-text-muted hover:border-text-muted hover:text-text"
        )}
      >
        {t.nav.contact}
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-full z-10 mt-2 flex flex-col items-stretch gap-1.5 transition-all duration-200",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <ConnectDropdownLink href={profile.telegram} label={t.connect.telegram} open={open} />
        <ConnectDropdownLink href={`mailto:${profile.email}`} label={t.connect.email} open={open} />
        <ConnectDropdownLink href={profile.twitter} label={t.connect.twitter} open={open} />
      </div>
    </div>
  );
}

function ConnectDropdownLink({ href, label, open }: { href: string; label: string; open: boolean }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      tabIndex={open ? 0 : -1}
      className="cursor-pointer whitespace-nowrap rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-4 py-1.5 text-right font-mono text-[11px] uppercase tracking-wide text-text-muted shadow-sm transition-all hover:text-text active:scale-95"
    >
      {label}
    </a>
  );
}
