import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { defaultLocale } from "@/content/types";
import { getCopy } from "@/content/copy";

export default function LocaleNotFound() {
  const t = getCopy(defaultLocale);

  return (
    <div className="flex min-h-[60vh] items-center py-24">
      <Container>
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">404</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 max-w-md text-text-muted">{t.notFound.body}</p>
        <Link
          href={`/${defaultLocale}`}
          className="group mt-8 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text transition-colors hover:text-signal-text"
        >
          <span aria-hidden className="inline-block h-px w-4 bg-current transition-all group-hover:w-6" />
          {t.notFound.cta}
        </Link>
      </Container>
    </div>
  );
}
