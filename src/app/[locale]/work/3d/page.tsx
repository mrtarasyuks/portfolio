import { WorldGallery } from "@/components/work/WorldGallery";
import { locales, type Locale } from "@/content/types";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/3d");
}

export default async function ThreeDWorldPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WorldGallery locale={locale as Locale} world="3d" />;
}
