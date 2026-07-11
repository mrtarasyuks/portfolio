import { Container } from "@/components/ui/Container";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { profile } from "@/content/profile";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function ContactSection({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section id="contact" className="border-t border-line py-24 md:py-32">
      <Container>
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.contact.eyebrow}</p>
        <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-tight text-text md:text-5xl">{t.contact.title}</h2>
        <p className="mt-6 max-w-md text-text-muted">
          <TypewriterText text={t.contact.body} startDelayMs={300} speedMs={12} />
        </p>

        {profile.availabilityConfirmed && (
          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-signal">{t.contact.availability}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-8">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal"
          >
            <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
            {t.contact.ctaPrimary}
          </a>
          <CopyEmailButton label={t.contact.ctaSecondary} copiedLabel={t.hero.emailCopied} />
        </div>
      </Container>
    </section>
  );
}
