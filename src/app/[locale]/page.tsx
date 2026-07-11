import { HeroSceneGate } from "@/components/hero/HeroSceneGate";
import { AcrossLayers } from "@/components/sections/AcrossLayers";
import { Capabilities } from "@/components/sections/Capabilities";
import { Workflow } from "@/components/sections/Workflow";
import { AgentNative } from "@/components/sections/AgentNative";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { locales, type Locale } from "@/content/types";
import { publicAssetExists } from "@/lib/publicAsset";
import {
  BIO_CARD_PORTRAIT_SRC,
  BIO_CARD_PHOTO_RIGHT_SRC,
  BIO_CARD_PHOTO_BACK_SRC,
  BIO_CARD_PHOTO_LEFT_SRC,
} from "@/content/assetPaths";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const hasPortrait = publicAssetExists(BIO_CARD_PORTRAIT_SRC);
  const hasPhotoRight = publicAssetExists(BIO_CARD_PHOTO_RIGHT_SRC);
  const hasPhotoBack = publicAssetExists(BIO_CARD_PHOTO_BACK_SRC);
  const hasPhotoLeft = publicAssetExists(BIO_CARD_PHOTO_LEFT_SRC);

  return (
    <>
      <HeroSceneGate
        locale={l}
        hasPortrait={hasPortrait}
        hasPhotoRight={hasPhotoRight}
        hasPhotoBack={hasPhotoBack}
        hasPhotoLeft={hasPhotoLeft}
      />
      <AcrossLayers locale={l} />
      <Capabilities locale={l} />
      <Workflow locale={l} />
      <AgentNative locale={l} />
      <AboutSection locale={l} />
      <ContactSection locale={l} />
    </>
  );
}
