import Link from "next/link";
import { MetaverseCanvasGate } from "@/components/scene/metaverse/MetaverseCanvasGate";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/3d/metaverse");
}

/**
 * The 3D Lab — a fullscreen, no-chrome platform (no title/tagline text, no page padding): clicking
 * in from the /work/3d gallery drops you straight into the space instead of a normal scrolling
 * case-study page. The only UI is a small floating back button — always dark-glass regardless of
 * site theme, the same "3D canvas ignores the light/dark toggle" convention the homepage hero and
 * `BioCard` already follow, since this is an atmospheric dark scene independent of site chrome.
 */
export default async function MetaversePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);

  return (
    <div className="relative w-full overflow-hidden bg-[#050814]" style={{ height: "calc(100dvh - var(--header-h, 6rem))" }}>
      <Link
        href={`/${l}/work/3d`}
        aria-label={t.orbit.back}
        title={t.orbit.back}
        className="absolute left-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
      </Link>

      <MetaverseCanvasGate t={t} />
    </div>
  );
}
