import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { locales, type Locale, type ThemeMode } from "@/content/types";
import { buildMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { WorldNavProvider } from "@/context/WorldNavContext";
import { GridScrollProvider } from "@/context/GridScrollContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "../globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  return buildMetadata(locale as Locale);
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const cookieStore = await cookies();
  const initialTheme: ThemeMode = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html
      lang={locale}
      data-theme={initialTheme}
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-signal-ink"
        >
          Skip to content
        </a>
        <ThemeProvider initialTheme={initialTheme}>
          <AmbientBackground />
          <WorldNavProvider>
            <GridScrollProvider>
              <SiteHeader locale={locale as Locale} />
              <main id="main" className="flex-1">
                {children}
              </main>
            </GridScrollProvider>
          </WorldNavProvider>
          <SiteFooter locale={locale as Locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
