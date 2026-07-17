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

const ACCENT = extraWorkAccents.tools;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "/work/tools");
}

export default async function ToolsWorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);
  const toolsProjects = projects.filter((p) => p.extraWork === "tools");
  const logoBySlug = Object.fromEntries(toolsProjects.map((p) => [p.slug, publicAssetExists(projectLogoSrc(p.slug))]));

  return (
    <ExtraWorkGalleryShell locale={l} t={t} label={t.extraWork.tools.label} tagline={t.extraWork.tools.tagline} glyph="⚙" color={ACCENT}>
      {toolsProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolsProjects.map((project, i) => (
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
