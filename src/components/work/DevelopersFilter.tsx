"use client";

import { useState } from "react";
import { GlassProjectBlock } from "@/components/work/GlassProjectBlock";
import { StaggerFadeIn } from "@/components/ui/StaggerFadeIn";
import { cn } from "@/lib/cn";
import type { PortfolioProject, Locale } from "@/content/types";
import type { CopyDict } from "@/content/copy";

type Category = "all" | "app" | "website" | "game";

/** Developers-world-only filter tabs (Apps/Websites/Games) over the existing project grid — client-only since filtering needs interactivity, kept as a small sub-component rather than converting the whole (mostly server) WorldGallery. */
export function DevelopersFilter({ projects, locale, t }: { projects: PortfolioProject[]; locale: Locale; t: CopyDict }) {
  const [category, setCategory] = useState<Category>("all");
  const filtered = category === "all" ? projects : projects.filter((p) => p.developerCategory === category);

  const tabs: { key: Category; label: string }[] = [
    { key: "all", label: t.developersFilter.all },
    { key: "app", label: t.developersFilter.apps },
    { key: "website", label: t.developersFilter.websites },
    { key: "game", label: t.developersFilter.games },
  ];

  return (
    <div>
      <div className="mb-12 flex flex-wrap justify-center gap-3 font-mono text-sm uppercase tracking-wide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setCategory(tab.key)}
            aria-pressed={category === tab.key}
            className={cn(
              "cursor-pointer rounded-full border px-6 py-3 font-medium shadow-sm transition-all active:scale-95",
              category === tab.key
                ? "border-signal bg-signal text-signal-ink shadow-[0_0_30px_-8px_var(--signal)]"
                : "border-line-strong bg-gradient-to-b from-surface-soft to-surface text-text-muted hover:border-text-muted hover:text-text"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <StaggerFadeIn key={project.slug} index={i}>
              <GlassProjectBlock project={project} locale={locale} t={t} />
            </StaggerFadeIn>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center font-mono text-sm uppercase tracking-wide text-text-dim">{t.orbit.comingSoon}</p>
      )}
    </div>
  );
}
