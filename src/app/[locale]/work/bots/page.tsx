import { ExtraWorkGalleryShell } from "@/components/work/ExtraWorkGalleryShell";
import { GlassProjectBlock } from "@/components/work/GlassProjectBlock";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { projects } from "@/content/projects";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { extraWorkAccents } from "@/content/worldTheme";
import { projectLogoSrc } from "@/content/assetPaths";
import { publicAssetExists } from "@/lib/publicAsset";
import { buildMetadata } from "@/lib/seo";

const ACCENT = extraWorkAccents.bots;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/bots");
}

export default async function BotsWorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);
  const botsProjects = projects.filter((p) => p.extraWork === "bots");
  const logoBySlug = Object.fromEntries(botsProjects.map((p) => [p.slug, publicAssetExists(projectLogoSrc(p.slug))]));

  return (
    <ExtraWorkGalleryShell locale={l} t={t} label={t.extraWork.bots.label} tagline={t.extraWork.bots.tagline} glyph="◈" color={ACCENT}>
      {botsProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {botsProjects.map((project, i) => (
            <StaggerFadeIn key={project.slug} index={i}>
              <GlassProjectBlock project={project} locale={l} t={t} colorOverride={ACCENT} hasLogo={logoBySlug[project.slug] ?? false} />
            </StaggerFadeIn>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
      )}
    </ExtraWorkGalleryShell>
  );
}
