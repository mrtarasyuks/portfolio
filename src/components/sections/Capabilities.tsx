import { Container } from "@/components/ui/Container";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { getCopy } from "@/content/copy";
import { worldThemes } from "@/content/worldTheme";
import type { Locale } from "@/content/types";

const ACCENT = worldThemes.developers.signal;

export function Capabilities({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <Container className="flex flex-col items-center text-center">
        <WorldTitleCube label={t.capabilities.eyebrow} color={ACCENT} headingTag="h2" />
        <p className="mt-6 max-w-lg text-lg text-text-muted">{t.capabilities.title}</p>

        <div className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {t.capabilities.groups.map((group, i) => (
            <StaggerFadeIn key={group.label} index={i}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line-strong bg-gradient-to-b from-surface-soft to-surface p-6 pt-16 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_var(--signal)]">
                {/* Number badge pinned to the corner as part of the card's own construction (a
                    tinted background tab) rather than loose text floating in the content flow. */}
                <span
                  className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-gradient-to-br from-signal/25 to-transparent font-display text-xl font-black text-signal-text shadow-[0_0_20px_-8px_var(--signal)] transition-colors duration-300 group-hover:from-signal/40"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium text-text">{group.label}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-signal/30 bg-gradient-to-b from-signal/15 to-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-signal-text shadow-[0_0_16px_-6px_var(--signal)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerFadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
