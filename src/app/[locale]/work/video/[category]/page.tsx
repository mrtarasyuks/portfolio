import { notFound } from "next/navigation";
import { ExtraWorkGalleryShell } from "@/components/work/ExtraWorkGalleryShell";
import { VideoCategoryGrid } from "@/components/work/VideoCategoryGrid";
import { VIDEO_CATEGORIES, type VideoCategory } from "@/content/videos";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { getWorldTheme } from "@/content/worldTheme";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => VIDEO_CATEGORIES.map((category) => ({ locale, category })));
}

type PageProps = { params: Promise<{ locale: string; category: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale, category } = await params;
  if (!VIDEO_CATEGORIES.includes(category as VideoCategory)) return {};
  const t = getCopy(locale as Locale);
  const meta = buildMetadata(locale as Locale, `/work/video/${category}`);
  return { ...meta, title: `${t.videoWorld.categories[category as VideoCategory]} — ${meta.title}` };
}

export default async function VideoCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  if (!VIDEO_CATEGORIES.includes(category as VideoCategory)) notFound();

  const l = locale as Locale;
  const c = category as VideoCategory;
  const t = getCopy(l);
  const theme = getWorldTheme("video");

  return (
    <ExtraWorkGalleryShell
      locale={l}
      t={t}
      label={t.videoWorld.categories[c]}
      tagline={t.videoWorld.allClips}
      glyph="▷"
      color={theme.signal}
      backHref={`/${l}/work/video`}
    >
      <VideoCategoryGrid category={c} t={t} />
    </ExtraWorkGalleryShell>
  );
}
