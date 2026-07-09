import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { profile } from "@/content/profile";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <header className="relative z-50 border-b border-line">
      <Container className="flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="font-mono text-sm tracking-wide text-text hover:text-signal">
          {profile.handle}
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-wide md:flex">
          <Link href={`/${locale}/work`} className="text-text-muted transition-colors hover:text-text">
            {t.nav.work}
          </Link>
          <Link href={`/${locale}/about`} className="text-text-muted transition-colors hover:text-text">
            {t.nav.about}
          </Link>
          <Link href={`/${locale}#contact`} className="text-text-muted transition-colors hover:text-text">
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <LanguageSwitch locale={locale} />
          <MobileMenu locale={locale} />
        </div>
      </Container>
    </header>
  );
}
