import { Container } from "@/components/ui/Container";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { getCopy } from "@/content/copy";
import { profile } from "@/content/profile";
import { locales, type Locale } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="pb-24 pt-14 md:pb-32 md:pt-20">
      <Container>
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.about.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-5xl">{profile.name}</h1>
        <p className="mt-2 font-mono text-sm uppercase tracking-wide text-signal">{t.hero.role}</p>

        <div className="mt-10 max-w-2xl space-y-6">
          {t.about.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-text-muted md:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <CopyEmailButton label={t.contact.ctaSecondary} copiedLabel={t.hero.emailCopied} />
        </div>
      </Container>
    </div>
  );
}
