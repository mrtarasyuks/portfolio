"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { profile } from "@/content/profile";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { Locale } from "@/content/types";
import { getCopy } from "@/content/copy";

const pillClass =
  "block cursor-pointer whitespace-nowrap rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-3 py-1.5 text-text shadow-sm transition-all active:scale-95 hover:border-signal hover:text-signal-text";

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const t = getCopy(locale);

  function closeAll() {
    setOpen(false);
    setConnectOpen(false);
  }

  return (
    <div className="shrink-0 md:hidden">
      {/* Brighter/highlighted resting state (signal-tinted border+glow+lines, not the plain gray
          pill every other header icon uses) so the menu button reads as a distinct primary
          action, not just one more circular icon — flips to a solid signal fill while open. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn(
          "flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border transition-all active:scale-90",
          open
            ? "border-transparent shadow-[0_0_22px_-4px_var(--signal)]"
            : "border-signal/60 bg-gradient-to-b from-surface-soft to-surface shadow-[0_0_16px_-6px_var(--signal)]"
        )}
        style={open ? { background: "linear-gradient(160deg, var(--signal), var(--signal-soft))" } : undefined}
      >
        <span
          className={cn(
            "block h-0.5 w-4 rounded-full transition-transform",
            open ? "translate-y-[3.5px] rotate-45 bg-signal-ink" : "bg-signal"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-4 rounded-full transition-transform",
            open ? "-translate-y-[3.5px] -rotate-45 bg-signal-ink" : "bg-signal"
          )}
        />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-t border-line bg-bg px-[var(--grid-margin)] py-6">
          {/* One row: Work/About/Connect pills, then the language flags right beside them — all
              wrap together onto a second line as one unit on the narrowest viewports, instead of
              the language switch landing on its own separate row below. */}
          <ul className="flex flex-wrap items-start gap-2 font-mono text-xs uppercase tracking-wide">
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
                  // `max-w-0` alongside `max-h-0` — without it the hidden Telegram/Email/Twitter
                  // row still reported its full ~250px width to the flex-wrap layout above even
                  // while its height was collapsed, which forced the Connect pill onto its own
                  // line instead of sitting beside Work/About.
                  "flex flex-row flex-wrap items-center gap-2 overflow-hidden transition-all duration-200",
                  connectOpen ? "max-h-40 max-w-[280px] opacity-100" : "pointer-events-none max-h-0 max-w-0 opacity-0"
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
            <li className="ml-1">
              <LanguageSwitch locale={locale} />
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
