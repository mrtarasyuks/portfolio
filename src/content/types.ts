export const locales = ["en", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type ThemeMode = "dark" | "light";

export type LocalizedString = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type ProjectStatus =
  | "shipped"
  | "in-testing"
  | "prototype"
  | "concept"
  | "client-work"
  | "system-design"
  | "experiment";

export type ProjectTier = "flagship" | "featured" | "compact";

/**
 * These are also static route segments at /work/3d, /work/video, /work/developers
 * (src/app/[locale]/work/{3d,video,developers}/page.tsx), which sit next to the
 * dynamic /work/[slug] case-study route. A project slugged exactly "3d", "video",
 * or "developers" would be permanently shadowed by its world's gallery page —
 * treat these three strings as reserved and never use them as a project slug.
 */
export const worlds = ["3d", "video", "developers"] as const;
export type ProjectWorld = (typeof worlds)[number];

export type ProjectMedia = {
  kind: "diagram" | "cover" | "video" | "screenshot";
  label: string;
  /** Only for kind: "video" | "screenshot" — set once the user supplies footage/images. */
  src?: string;
  /** Only for kind: "video" — groups the Video-world gallery's "videos by category" section. */
  category?: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  status: ProjectStatus;
  tier: ProjectTier;
  world: ProjectWorld;
  /** Only meaningful for world: "developers" — powers the Apps/Websites/Games filter tabs on /work/developers. */
  developerCategory?: "app" | "website" | "game";
  role: string[];
  stack?: string[];
  capabilities?: string[];
  oneLine: LocalizedString;
  summary: LocalizedString;
  challenge?: LocalizedString;
  approach?: LocalizedList;
  outcomes?: LocalizedList;
  media?: ProjectMedia[];
  links?: ProjectLink[];
  confidentialityNote?: LocalizedString;
  verificationNote?: LocalizedString;
};
