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
        <div className="flex items-center justify-between md:justify-self-start md:gap-4">
          <HeaderLogoButton locale={locale} />

          {/* Desktop-only instance — the left grid column has far more free width than the
              crowded center column (just the logo pill otherwise), so the toggle's expanding
              speed panel lives here instead of pushing/overlapping the world-switch nav next to
              it. Rendering the same gated component twice, visible at only one breakpoint at a
              time, mirrors this codebase's existing desktop/mobile dual-render pattern (FlagIcon). */}
          <div className="hidden md:block">
            <HeroGridScrollBar locale={locale} />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle t={t} />
            <MobileMenu locale={locale} />
          </div>
        </div>

        <div className="order-last flex flex-col items-center gap-1.5 md:order-none md:flex-row md:justify-self-center md:gap-3">
          <div className="md:hidden">
            <HeroGridScrollBar locale={locale} />
          </div>
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
        "cursor-pointer rounded-full border border-line-strong bg-gradient-to-b from-surface-soft to-surface px-3 py-2 font-mono text-lg uppercase tracking-wide text-text-muted shadow-sm transition-all",
        // `bg-none` clears the gradient's `background-image` first — otherwise it keeps painting
        // over the solid `bg-signal` `background-color` and the fill never actually shows.
        "hover:border-signal hover:bg-none hover:bg-signal hover:text-signal-ink",
        "active:scale-95 active:border-signal active:bg-none active:bg-signal active:text-signal-ink active:shadow-[0_0_30px_-8px_var(--signal)]"
      )}
    >
      {children}
    </Link>
  );
}
