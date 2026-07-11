# Content evidence audit

Tracks what is code/repo-verified vs. user-asserted (from `CLAUDE_PREMIUM_PORTFOLIO_MASTER.md`) vs. still needing real assets. Nothing below is invented beyond what the master instruction file itself specifies as known project history.

## Foody
- Status: `in-testing`
- Evidence: full source at `../Foody` — Expo 54 / RN 0.81, TypeScript strict, Supabase (Auth/Postgres/Storage/Edge Functions), `ai-proxy` server-side model routing (Gemini primary, Claude fallback), receipt/fridge photo analysis, AI chef chat, voice input, 9-locale i18n, dark/light theme, secure token storage, Android Closed Testing in Play Console.
- Claims allowed: everything above (repo-verified).
- Claims not verified: public store launch, user counts, revenue, nutrition accuracy — **excluded**.
- Assets needed from user: app screenshots (fridge view, camera capture, AI chef chat, receipt import) for the case-study media mosaic. Until supplied, use a designed typographic cover + architecture diagram (no fabricated screenshots).

## AI Video Production System (now: FrameForg)
- Status: `shipped` (was `system-design` / `prototype`)
- Evidence: `../promo-video-platform` (aka FrameForg) — real repo: Next.js 16, Supabase, `Dockerfile` + `Dockerfile.worker` (background worker architecture), deployed via Coolify on Hetzner (per project memory), yellow/black rebrand, OAuth, Portfolio feature shipped.
- **2026-07-12 update**: verified live and public by directly fetching https://frameforg.online — real tagline ("AI Promo Videos Delivered in 1 Hour"), automated storyboard generation via an AI creative-director agent, 12+ AI engines, Remotion motion graphics, 9:16/16:9/1:1 output formats, QA pipeline, revision requests, and real paid pricing tiers with a working checkout. This resolves the prior "do not claim production-live without user confirmation" caveat with direct evidence rather than a user assertion. `projects.ts` slug renamed `ai-video-production` → `frameforg`, `status` → `shipped`, real `links: [{ label: "frameforg.online", href: "..." }]` added.
- Claims allowed: everything above, plus the live pipeline architecture (brief → AI creative-director → storyboard → multi-engine generation → Remotion → QA → delivery) as a shipped, public product.
- Claims not verified: specific user counts or revenue — **still excluded**, not claimed anywhere in copy.
- Assets needed: product screenshots or the pipeline diagram only (diagram can be built without screenshots) — the diagram continues to ship as the case-study cover.

## Coffydoor / Cruise Brothers / Cinematic Continuity Experiment (Elvis scene) — DROPPED
- 2026-07-10 decision (user, directly): these video ad projects are **not to be featured**. Removed from `content/projects.ts` entirely. Do not resurrect unless the user asks again.

## 3D Lab
- Two distinct things exist, do not conflate them:
  1. **3D-Shop** (`../3D-Shop`) — a real coded project: Expo/React Native + Supabase app for a 3D-printed-products shop. Per user (2026-07-10), this is evolving into **a separate website**, not this app, and is **not featured** in this portfolio for now.
  2. **Personal 3D/print practice** — user confirmed (2026-07-10) real skills across **Blender, Cinema 4D, and 3ds Max**, plus 3D printing of arbitrary objects (not one product line). Real **videos** of print work exist (not screenshots).
- Decision: "3D Lab" case study covers the personal practice only, broadened across all three DCC tools, described as printing "practically anything." Stack/role fields updated accordingly in `projects.ts`.
- Assets needed: the user's 3D-printing videos. **Until supplied, ships with the process-loop diagram only** — `ProjectMedia` type should support a `video` kind for when footage is provided (add a TODO marker, do not fabricate a placeholder video).

## Future work (not yet built)
- User is developing further websites, apps, and games — the content model (`projects.ts` as a flat array) is intentionally easy to extend: adding a new project is one object, no structural changes needed.

## Foody Support Automation
- Status: `prototype` (Telegram webhook exists; escalation/AI-response logic per master file)
- Evidence: `../foody-support-bot` — real Cloudflare Worker repo (`wrangler.toml`, `index.js`).
- Claims allowed: Telegram → Cloudflare Worker → forward/AI-response architecture.
- Claims not verified: production usage volume — excluded.

## Self-Hosted Product Infrastructure
- Status: `shipped` for the deployment pattern itself (Coolify + Hetzner + GitHub push-to-deploy is verified via `promo-video-platform`'s Dockerfile + memory of its live Coolify deployment).
- Evidence: `../promo-video-platform` Dockerfiles, GitHub-based deploy workflow.
- Claims allowed: Claude Code / Codex → GitHub → Coolify → Hetzner → domain pipeline.
- Claims not verified: specific uptime, specific number of deployed services — excluded.

## Resolved (2026-07-10, user decisions)
1. Coffydoor, Cruise Brothers, and the Elvis-scene experiment are **dropped** — not featured.
2. `3D-Shop` is **not featured** — it's becoming a separate website, unrelated to this portfolio's "3D Lab" (personal Blender/Cinema 4D/3ds Max/FDM practice).
3. Pace: build autonomously through all remaining phases, review together at the end.

## Resolved (2026-07-10, later same day)
1. Real 3D avatar supplied at `public/model/model-tarasiuk.glb` (Tripo3D-generated) — compressed 16.8MB → 807KB, integrated as the hero's central figure replacing the wireframe placeholder. See `docs/design-decisions.md`'s "real avatar + three-world atmosphere" section.
2. Video hosting decided: self-hosted via Coolify (Caddy + volume) on the user's existing Hetzner server — see `docs/media-hosting.md` for exact setup steps the user needs to run (no access to their infra from this session).
3. "More pages" resolved as both: world-specific gallery pages (`/work/3d`, `/work/video`, `/work/developers`) now exist, and the flat case-study system (`/work/[slug]`) remains open for new projects.

## Still open
1. Foody screenshots exist (confirmed by user) but haven't been supplied yet — `/work/foody` currently ships with the diagram-only cover. Swap in real screenshots when available.
2. 3D-printing videos exist (confirmed by user) but haven't been supplied — `ProjectMedia` supports a `video` kind (rendered via `ProjectVideo`) for `3d-lab` once footage lands and `NEXT_PUBLIC_MEDIA_BASE_URL` is configured per `docs/media-hosting.md`.
3. Availability status line stays hidden (`profile.availabilityConfirmed = false`) until the user confirms current availability.
4. User is developing further websites/apps/games — add them to `projects.ts` as they ship (see reserved-slug note next to the `worlds` export in `src/content/types.ts` — never slug a project `3d`, `video`, or `developers`).
