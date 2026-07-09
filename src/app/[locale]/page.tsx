import { HeroSceneGate } from "@/components/hero/HeroSceneGate";
import { AcrossLayers } from "@/components/sections/AcrossLayers";
import { Capabilities } from "@/components/sections/Capabilities";
import { Workflow } from "@/components/sections/Workflow";
import { AgentNative } from "@/components/sections/AgentNative";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { locales, type Locale } from "@/content/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <>
      <HeroSceneGate locale={l} />
      <AcrossLayers locale={l} />
      <Capabilities locale={l} />
      <Workflow locale={l} />
      <AgentNative locale={l} />
      <AboutSection locale={l} />
      <ContactSection locale={l} />
    </>
  );
}
