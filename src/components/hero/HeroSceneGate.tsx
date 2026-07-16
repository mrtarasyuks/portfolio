"use client";

import { HeroIdentity } from "@/components/hero/HeroIdentity";
import { HeroOrbitScene } from "@/components/hero/HeroOrbitScene";
import { useMotionCapability } from "@/hooks/useWebglSupport";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function HeroSceneGate({
  locale,
  hasPortrait,
  hasPhotoRight,
  hasPhotoBack,
  hasPhotoLeft,
  logoBySlug,
}: {
  locale: Locale;
  hasPortrait: boolean;
  hasPhotoRight: boolean;
  hasPhotoBack: boolean;
  hasPhotoLeft: boolean;
  logoBySlug: Record<string, boolean>;
}) {
  const { ready, webglSupported, reducedMotion } = useMotionCapability();
  const t = getCopy(locale);

  if (!ready || !webglSupported) {
    return <HeroIdentity locale={locale} />;
  }

  return (
    <HeroOrbitScene
      locale={locale}
      t={t}
      reducedMotion={reducedMotion}
      hasPortrait={hasPortrait}
      hasPhotoRight={hasPhotoRight}
      hasPhotoBack={hasPhotoBack}
      hasPhotoLeft={hasPhotoLeft}
      logoBySlug={logoBySlug}
    />
  );
}
