"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Locale } from "@/content/types";
import { getCopy } from "@/content/copy";

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
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span className={cn("block h-px w-5 bg-text transition-transform", open && "translate-y-[3.5px] rotate-45")} />
        <span className={cn("block h-px w-5 bg-text transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-t border-line bg-bg px-[var(--grid-margin)] py-6">
          <ul className="flex flex-col gap-4 font-mono text-sm uppercase tracking-wide">
            <li>
              <Link href={`/${locale}/work`} onClick={() => setOpen(false)} className="block py-1 text-text hover:text-signal">
                {t.nav.work}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} onClick={() => setOpen(false)} className="block py-1 text-text hover:text-signal">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#contact`} onClick={() => setOpen(false)} className="block py-1 text-text hover:text-signal">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
