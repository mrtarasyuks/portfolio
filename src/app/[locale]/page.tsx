import { HeroSceneGate } from "@/components/hero/HeroSceneGate";
import { ToolLogosMarquee } from "@/components/sections/ToolLogosMarquee";
import { Capabilities } from "@/components/sections/Capabilities";
import { Workflow } from "@/components/sections/Workflow";
import { AgentNative } from "@/components/sections/AgentNative";
import { getCopy } from "@/content/copy";
import { locales, type Locale } from "@/content/types";
import { projects } from "@/content/projects";
import { publicAssetExists } from "@/lib/publicAsset";
import {
  BIO_CARD_PORTRAIT_SRC,
  BIO_CARD_PHOTO_RIGHT_SRC,
  BIO_CARD_PHOTO_BACK_SRC,
  BIO_CARD_PHOTO_LEFT_SRC,
  projectLogoSrc,
} from "@/content/assetPaths";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = getCopy(l);
  const hasPortrait = publicAssetExists(BIO_CARD_PORTRAIT_SRC);
  const hasPhotoRight = publicAssetExists(BIO_CARD_PHOTO_RIGHT_SRC);
  const hasPhotoBack = publicAssetExists(BIO_CARD_PHOTO_BACK_SRC);
  const hasPhotoLeft = publicAssetExists(BIO_CARD_PHOTO_LEFT_SRC);
  const logoBySlug = Object.fromEntries(projects.map((p) => [p.slug, publicAssetExists(projectLogoSrc(p.slug))]));

  return (
    <>
      <HeroSceneGate
        locale={l}
        hasPortrait={hasPortrait}
        hasPhotoRight={hasPhotoRight}
        hasPhotoBack={hasPhotoBack}
        hasPhotoLeft={hasPhotoLeft}
        logoBySlug={logoBySlug}
      />
      <ToolLogosMarquee t={t} />
      <Capabilities locale={l} />
      <Workflow locale={l} />
      <AgentNative locale={l} />
    </>
  );
}
