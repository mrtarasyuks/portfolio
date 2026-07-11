"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { profile } from "@/content/profile";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { Locale } from "@/content/types";
import { getCopy } from "@/content/copy";

const pillClass =
  "block cursor-pointer rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-4 py-2 text-text shadow-sm transition-all active:scale-95 hover:border-signal hover:text-signal";

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = getCopy(locale);

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
          <ul className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wide">
            <li>
              <Link href={`/${locale}/work`} onClick={() => setOpen(false)} className={pillClass}>
                {t.nav.work}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} onClick={() => setOpen(false)} className={pillClass}>
                {t.nav.about}
              </Link>
            </li>
            <li>
              <a href={profile.telegram} target="_blank" rel="noreferrer" className={pillClass}>
                {t.connect.telegram}
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className={pillClass}>
                {t.connect.email}
              </a>
            </li>
            <li>
              <a href={profile.twitter} target="_blank" rel="noreferrer" className={pillClass}>
                {t.connect.twitter}
              </a>
            </li>
          </ul>

          <div className="mt-6 border-t border-line pt-6">
            <LanguageSwitch locale={locale} />
          </div>
        </nav>
      )}
    </div>
  );
}
