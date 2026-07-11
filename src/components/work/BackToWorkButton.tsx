import Link from "next/link";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/** Round glass "back" button — sits beside a gallery page's glass-cube title. Shared by
 * `WorldGallery` and the Games/AI Creator/video-category work pages (which aren't `WorldGallery`-
 * backed, since they aren't real `ProjectWorld` entries). Defaults to `/work`; pass `backHref` for
 * a page nested one level deeper (e.g. a video category page backing up to `/work/video` instead). */
export function BackToWorkButton({ locale, t, backHref }: { locale: Locale; t: CopyDict; backHref?: string }) {
  return (
    <Link
      href={backHref ?? `/${locale}/work`}
      aria-label={t.orbit.back}
      title={t.orbit.back}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-tint)] text-text shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}
