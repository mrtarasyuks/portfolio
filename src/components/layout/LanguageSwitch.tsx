"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { setLocaleCookie } from "@/lib/locale-cookie";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    const rest = pathname.replace(/^\/(en|uk)/, "");
    router.push(`/${next}${rest}`);
  }

  return (
    <div className="flex items-center gap-1 font-mono text-xs tracking-wide" aria-label="Language">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-dim">/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale}
            className={cn(
              "px-1 py-0.5 uppercase transition-colors",
              l === locale ? "text-signal" : "text-text-dim hover:text-text"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
