import type { MetadataRoute } from "next";
import { locales, worlds } from "@/content/types";
import { projects } from "@/content/projects";
import { VIDEO_CATEGORIES } from "@/content/videos";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/work",
    "/about",
    "/contact",
    ...worlds.map((w) => `/work/${w}`),
    "/work/games",
    "/work/ai-creator",
    ...VIDEO_CATEGORIES.map((c) => `/work/video/${c}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({ url: `${siteUrl}/${locale}${path}`, lastModified: new Date() });
    }
    for (const project of projects) {
      entries.push({ url: `${siteUrl}/${locale}/work/${project.slug}`, lastModified: new Date() });
    }
  }

  return entries;
}
