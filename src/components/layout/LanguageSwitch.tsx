"use client";

import { usePathname, useRouter } from "next/navigation";
import { FlagIcon } from "@/components/layout/FlagIcon";
import { locales, type Locale } from "@/content/types";
import { cn } from "@/lib/cn";
import { setLocaleCookie } from "@/lib/locale-cookie";

const NAME: Record<Locale, string> = { en: "English", uk: "Українська" };

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
    <div className="flex items-center gap-1.5" aria-label="Language">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          aria-label={NAME[l]}
          title={NAME[l]}
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border shadow-sm transition-all active:scale-90",
            l === locale ? "border-signal opacity-100" : "border-line-strong opacity-55 hover:opacity-90"
          )}
        >
          <FlagIcon locale={l} className="h-full w-full" />
        </button>
      ))}
    </div>
  );
}
