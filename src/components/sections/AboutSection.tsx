import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function AboutSection({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section id="about" className="border-t border-line bg-paper py-20 text-signal-ink md:py-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-wide text-signal-ink/60">{t.about.eyebrow}</p>
        <h2 className="sr-only">{t.about.title}</h2>
        <div className="mt-6 max-w-2xl space-y-6">
          {t.about.body.map((paragraph, i) => (
            <p
              key={i}
              className={i === 0 ? "font-serif-accent text-2xl leading-snug md:text-3xl" : "text-base leading-relaxed text-signal-ink/80 md:text-lg"}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
