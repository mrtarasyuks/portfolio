"use client";

import { useState } from "react";
import { FigurineCard } from "@/components/work/FigurineCard";
import { FigurineDetailModal } from "@/components/work/FigurineDetailModal";
import { figurines, type Figurine } from "@/content/figurines";
import type { Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

/** Renders nothing until real figurines land in `figurines.ts` — no fabricated placeholder/empty
 * state, matching this project's established deferred-content pattern (Games, AI Creator). */
export function FigurineGallery({ locale, t }: { locale: Locale; t: CopyDict }) {
  const [open, setOpen] = useState<Figurine | null>(null);

  if (figurines.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-center font-mono text-xs uppercase tracking-wide text-text-dim">
        {t.figurines.sectionTitle}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {figurines.map((figurine) => (
          <FigurineCard key={figurine.slug} figurine={figurine} locale={locale} onOpen={() => setOpen(figurine)} />
        ))}
      </div>
      {open && <FigurineDetailModal figurine={open} locale={locale} t={t} onClose={() => setOpen(null)} />}
    </div>
  );
}
