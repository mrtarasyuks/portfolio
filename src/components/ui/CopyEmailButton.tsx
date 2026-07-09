"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

export function CopyEmailButton({
  label,
  copiedLabel,
  className,
}: {
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op, user can still read the email in Contact
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text-muted transition-colors hover:text-signal",
        className
      )}
    >
      <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
      {copied ? copiedLabel : label}
    </button>
  );
}
