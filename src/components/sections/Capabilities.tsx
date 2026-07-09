import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function Capabilities({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">{t.capabilities.eyebrow}</p>
        <h2 className="mt-3 max-w-lg text-3xl font-medium tracking-tight text-text md:text-4xl">
          {t.capabilities.title}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {t.capabilities.groups.map((group, i) => (
            <div key={group.label} className="border-t border-line pt-6">
              <span className="font-mono text-xs text-text-dim">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-medium text-text">{group.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
