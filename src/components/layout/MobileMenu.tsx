"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { profile } from "@/content/profile";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { Locale } from "@/content/types";
import { getCopy } from "@/content/copy";

const pillClass =
  "block cursor-pointer rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-4 py-2 text-text shadow-sm transition-all active:scale-95 hover:border-signal hover:text-signal-text";

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const t = getCopy(locale);

  function closeAll() {
    setOpen(false);
    setConnectOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface shadow-sm transition-transform active:scale-90"
      >
        <span className={cn("block h-px w-4 bg-text transition-transform", open && "translate-y-[3.5px] rotate-45")} />
        <span className={cn("block h-px w-4 bg-text transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-t border-line bg-bg px-[var(--grid-margin)] py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <ul className="flex flex-wrap items-start gap-3 font-mono text-xs uppercase tracking-wide">
              <li>
                <Link href={`/${locale}/work`} onClick={closeAll} className={pillClass}>
                  {t.nav.work}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} onClick={closeAll} className={pillClass}>
                  {t.nav.about}
                </Link>
              </li>
              <li className="flex flex-col items-start gap-2">
                {/* One Connect entry, not three flattened pills — same toggle-open sub-list pattern
                    `HeaderConnectButton` already uses on desktop, adapted to this vertical dropdown. */}
                <button
                  type="button"
                  onClick={() => setConnectOpen((v) => !v)}
                  aria-expanded={connectOpen}
                  className={cn(pillClass, "cursor-pointer")}
                >
                  {t.nav.contact}
                </button>
                <div
                  aria-hidden={!connectOpen}
                  className={cn(
                    "flex flex-row flex-wrap items-center gap-2 overflow-hidden pl-2 transition-all duration-200",
                    connectOpen ? "max-h-40 opacity-100" : "pointer-events-none max-h-0 opacity-0"
                  )}
                >
                  <a href={profile.telegram} target="_blank" rel="noreferrer" tabIndex={connectOpen ? 0 : -1} className={pillClass}>
                    {t.connect.telegram}
                  </a>
                  <a href={`mailto:${profile.email}`} tabIndex={connectOpen ? 0 : -1} className={pillClass}>
                    {t.connect.email}
                  </a>
                  <a href={profile.twitter} target="_blank" rel="noreferrer" tabIndex={connectOpen ? 0 : -1} className={pillClass}>
                    {t.connect.twitter}
                  </a>
                </div>
              </li>
            </ul>

            {/* Language switch sits beside the nav pills now — the bottom block it used to share
                with ThemeToggle is gone since ThemeToggle moved out to the header row itself. */}
            <LanguageSwitch locale={locale} />
          </div>
        </nav>
      )}
    </div>
  );
}
