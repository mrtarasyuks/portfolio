import type { Metadata } from "next";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/types";

export const siteUrl = "https://serhiitarasiuk.space";

const titles: Record<Locale, string> = {
  en: `${profile.name} — AI Product Builder & Creative Technologist`,
  uk: `${profile.name} — AI Product Builder & Creative Technologist`,
};

const descriptions: Record<Locale, string> = {
  en: `Portfolio of ${profile.name} — AI products, mobile apps, generative video systems, automation, 3D workflows, and production-minded deployment.`,
  uk: `Портфоліо ${profile.name} — AI-продукти, мобільні застосунки, генеративні відеосистеми, автоматизація, 3D та продакшн-деплой.`,
};

export function buildMetadata(locale: Locale, path = ""): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  return {
    metadataBase: new URL(siteUrl),
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path}`,
        uk: `${siteUrl}/uk${path}`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url,
      siteName: profile.name,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
    },
  };
}
