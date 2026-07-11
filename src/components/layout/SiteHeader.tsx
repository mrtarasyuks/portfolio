import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { WorldSwitchHeaderNav } from "@/components/layout/WorldSwitchHeaderNav";
import { HeroGridScrollBar } from "@/components/layout/HeroGridScrollBar";
import { HeaderConnectButton } from "@/components/layout/HeaderConnectButton";
import { HeaderLogoButton } from "@/components/layout/HeaderLogoButton";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/cn";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <header className="relative z-50">
      <Container className="grid grid-cols-1 items-center gap-y-3 py-4 md:grid-cols-[1fr_auto_1fr] md:gap-x-4 md:py-3">
        <div className="flex items-center justify-between md:justify-self-start">
          <HeaderLogoButton locale={locale} />

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle t={t} />
            <LanguageSwitch locale={locale} />
            <MobileMenu locale={locale} />
          </div>
        </div>

        <div className="order-last flex flex-col items-stretch gap-1.5 md:order-none md:flex-row md:items-center md:justify-self-center md:gap-3">
          <HeroGridScrollBar locale={locale} />
          <WorldSwitchHeaderNav locale={locale} />
        </div>

        <div className="hidden min-w-0 items-center justify-end gap-1.5 md:flex md:justify-self-end">
          <HeaderPillLink href={`/${locale}/work`}>{t.nav.work}</HeaderPillLink>
          <HeaderPillLink href={`/${locale}/about`}>{t.nav.about}</HeaderPillLink>
          <HeaderConnectButton t={t} />
          <ThemeToggle t={t} />
          <LanguageSwitch locale={locale} />
        </div>
      </Container>
    </header>
  );
}

function HeaderPillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "cursor-pointer rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface font-mono text-xs uppercase tracking-wide shadow-sm transition-all active:scale-95",
        "px-3 py-1.5 text-text-muted hover:border-text-muted hover:text-text"
      )}
    >
      {children}
    </Link>
  );
}
