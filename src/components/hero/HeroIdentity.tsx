import Link from "next/link";
import { CapabilitySignalRail } from "@/components/hero/CapabilitySignalRail";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/types";
import { getCopy } from "@/content/copy";

export function HeroIdentity({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="relative overflow-hidden border-b border-line pb-16 pt-14 md:pb-24 md:pt-20">
      <Container className="grid grid-cols-1 gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="mb-10 flex items-center justify-between font-mono text-xs uppercase tracking-wide text-text-dim">
            <span>{t.hero.eyebrow}</span>
            <span>{profile.location}</span>
          </div>

          <h1 className="max-w-2xl text-[clamp(2rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-text">
            {t.hero.headline}
          </h1>

          <p className="mt-6 font-mono text-sm uppercase tracking-wide text-signal-text">{t.hero.role}</p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">{t.hero.body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              href={`/${locale}/work`}
              className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal-text"
            >
              <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
              {t.hero.ctaPrimary}
            </Link>
            <CopyEmailButton label={t.hero.ctaSecondary} copiedLabel={t.hero.emailCopied} />
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <CapabilitySignalRail nodes={t.rail.nodes} label={t.rail.label} />
        </div>
      </Container>
    </section>
  );
}
