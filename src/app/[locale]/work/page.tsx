import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SelectedWorkList } from "@/components/work/SelectedWorkList";
import { getCopy } from "@/content/copy";
import { locales, worlds, type Locale } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work");
}

export default async function WorkIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="pb-20 md:pb-28">
      <SelectedWorkList locale={l} headingTag="h1" />

      <Container className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-8 font-mono text-xs uppercase tracking-wide">
        <span className="text-text-dim">{t.orbit.switchWorld}:</span>
        {worlds.map((w) => (
          <Link
            key={w}
            href={`/${l}/work/${w}`}
            className="border border-line-strong px-3 py-1.5 text-text-muted transition-colors hover:border-text-muted hover:text-text"
          >
            {t.orbit.worlds[w]}
          </Link>
        ))}
      </Container>
    </div>
  );
}
