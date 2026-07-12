import { Container } from "@/components/ui/Container";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { getCopy } from "@/content/copy";
import { profile } from "@/content/profile";
import { locales, type Locale } from "@/content/types";
import { worldThemes } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

const ACCENT = worldThemes.developers.signal;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="relative pb-24 pt-14 md:pb-32 md:pt-20">
      <PageTitleWatermark title={t.nav.contact} accent={ACCENT} />

      <Container className="relative">
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.contact.eyebrow}</p>
        <h1 className="mt-3 max-w-xl text-3xl font-medium tracking-tight text-text md:text-5xl">{t.contact.title}</h1>
        <p className="mt-6 max-w-md text-text-muted">
          <TypewriterText text={t.contact.body} startDelayMs={300} speedMs={12} />
        </p>

        {profile.availabilityConfirmed && (
          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-signal-text">{t.contact.availability}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-8">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal-text"
          >
            <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
            {t.contact.ctaPrimary}
          </a>
          <CopyEmailButton label={t.contact.ctaSecondary} copiedLabel={t.hero.emailCopied} />
        </div>
      </Container>
    </div>
  );
}
