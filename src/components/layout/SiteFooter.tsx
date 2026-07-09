import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/content/types";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col items-start justify-between gap-4 font-mono text-xs uppercase tracking-wide text-text-dim md:flex-row md:items-center">
        <span>
          {profile.name} — {year}. {t.footer.rights}
        </span>
        <span>{profile.location}</span>
      </Container>
    </footer>
  );
}
