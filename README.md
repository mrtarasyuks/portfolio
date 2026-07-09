# Serega Tarasyuk — Portfolio

Premium editorial portfolio for Serega Tarasyuk (AI Product Builder / Creative Technologist), built to `docs/brief.md` (the master spec). Design direction, content decisions, and evidence audit live in `docs/design-decisions.md` and `docs/content-evidence.md` — read those before changing content or visual system.

## Stack

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, Motion for React. No CMS, no database — content lives in `src/content/*.ts`.

## Develop

```bash
npm run dev     # http://localhost:3000 (or next available port)
npm run build   # production build + typecheck
npm run lint
```

## Structure

- `src/app/[locale]/` — routes (`en`/`uk`), root `/` redirects via `src/proxy.ts`
- `src/content/` — profile, projects, capabilities, localized copy (`copy.en.ts` / `copy.uk.ts`, type-checked against each other)
- `src/components/` — `hero/`, `work/`, `sections/`, `graphics/` (custom diagrams), `layout/`, `ui/`
- `docs/` — brief, design decisions, content evidence audit
- `.claude/agents/`, `.claude/skills/` — project subagents/skills used during design and build

## Adding a project

Add one object to `src/content/projects.ts` (`tier: "flagship"` for a full case study, `"compact"` for a lighter card) and localized one-liner/summary strings. No structural changes needed — this is deliberate, since more websites/apps/games are coming.

## Performance budget

- No large above-the-fold video/canvas engine in the hero — the Capability Signal Rail is plain markup + CSS/SVG.
- Below-fold sections are static Server Components; only the signal rail, language switch, mobile menu, and copy-email button ship client JS.
- Respect `prefers-reduced-motion` everywhere motion is added.

## Deployment (Hetzner + Coolify + GitHub)

`output: "standalone"` is set in `next.config.ts`. `Dockerfile` is a multi-stage build producing a minimal runtime image; `GET /api/health` returns `{"status":"ok"}` for Coolify's health check. Push to the production branch → Coolify auto-deploys. No runtime secrets are required in v1 (see `.env.example`).
