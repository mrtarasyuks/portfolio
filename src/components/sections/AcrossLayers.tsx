import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function AcrossLayers({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.acrossLayers.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-text md:text-4xl">{t.acrossLayers.title}</h2>
            <p className="mt-6 max-w-md text-text-muted">{t.acrossLayers.body}</p>
          </div>

          <div className="md:col-span-7 md:pt-2">
            <ol className="flex flex-wrap gap-x-2 gap-y-4 font-mono text-xs uppercase tracking-wide">
              {t.acrossLayers.layers.map((layer, i) => (
                <li key={layer} className="flex items-center gap-2">
                  <span className={i === 0 || i === t.acrossLayers.layers.length - 1 ? "text-signal" : "text-text-muted"}>
                    {layer}
                  </span>
                  {i < t.acrossLayers.layers.length - 1 && (
                    <span className="text-text-dim" aria-hidden>
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
