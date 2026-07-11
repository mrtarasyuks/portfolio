import { Container } from "@/components/ui/Container";
import { PageTitleWatermark } from "@/components/ui/PageTitleWatermark";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { WorldTitleCube } from "@/components/work/WorldTitleCube";
import { BackToWorkButton } from "@/components/work/BackToWorkButton";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/**
 * Same header shell as `WorldGallery` (back button + glyph/title cubes + tagline + pulsing
 * divider) for the two extra `/work` pages (Games, AI Creator) that aren't `WorldGallery`-backed
 * since they aren't real `ProjectWorld` entries — kept as one shared component so both pages (and
 * `WorldGallery`) stay visually identical without duplicating this JSX three times.
 */
export function ExtraWorkGalleryShell({
  locale,
  t,
  label,
  tagline,
  glyph,
  color,
  backHref,
  children,
}: {
  locale: Locale;
  t: CopyDict;
  label: string;
  tagline: string;
  glyph: string;
  color: string;
  /** Defaults to `/work`; pass for a page nested one level deeper (e.g. a video category page). */
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pb-20 md:pb-28">
      <PageTitleWatermark title={label} accent={color} />

      <Container className="relative flex flex-col items-center pb-20 pt-14 text-center md:pb-28 md:pt-20">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <BackToWorkButton locale={locale} t={t} backHref={backHref} />
          <div aria-hidden="true">
            <WorldTitleCube label={glyph} color={color} headingTag="div" />
          </div>
          <WorldTitleCube label={label} color={color} />
        </div>
        <p className="mt-8 max-w-lg text-text-muted">
          <TypewriterText text={tagline} startDelayMs={300} speedMs={12} />
        </p>
      </Container>

      <div
        className="pulse-line mx-auto h-px w-full max-w-[1440px] bg-line-strong"
        style={{ "--pulse-color": color } as React.CSSProperties}
        aria-hidden
      />

      <Container className="pt-10 pb-20 md:pb-28">{children}</Container>
    </div>
  );
}
