export const locales = ["en", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

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

export const worlds = ["3d", "video", "developers"] as const;
export type ProjectWorld = (typeof worlds)[number];

export type ProjectMedia = {
  kind: "diagram" | "cover" | "video";
  label: string;
  /** Only for kind: "video" — set once the user supplies footage. */
  src?: string;
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
