# Design decisions

Synthesis of Phase A discovery (ux-portfolio-architect, portfolio-story-editor, brand-art-director), reconciled into one direction. Where the three disagreed, this section is the tie-break — implementation follows this file, not the raw agent output.

## 2026-07-10 pivot: 3D orbit hero (supersedes the flat hero below for the homepage)

The user explicitly asked for a much more animated, spatial hero, overriding the master brief's original restraint-first direction for this one surface. Kept: Obsidian Signal palette, typography, mono system labels. Replaced: the flat `HeroIdentity` + `SelectedWorkList` combo on the homepage with an interactive 3D scene.

**What it is:** a full-viewport React Three Fiber `<Canvas>` — starfield + a signal-yellow-ringed planet, a stylized abstract wireframe humanoid ("Serega") levitating (via drei `Float`) at the center, the name floating above with a CSS keyframe bob, big circular prev/next buttons flanking the name, and project cards orbiting the figure on a ring below its feet. Three "world" tabs (3D / Video Creator / Developers) filter which projects orbit and swap the card's top-bar motif (`◆ MODEL` / `▷ SCREEN` / `</> APP`). Empty ring slots render as dashed "more work landing here soon" ghost cards rather than fake projects — a world with 1 real project still shows a 3-slot ring.

**Why these specific choices:**
- Orbit ring sits on its own Y plane well below the figure's feet (`centerY` prop on `OrbitRing`), not at the figure's height — the front-facing card is always screen-X-centered same as the figure, so only a Y offset avoids permanent overlap. Getting this right required accounting for perspective: cards at the *front* of the orbit are much closer to the camera than the figure itself, so they have a **much tighter vertical frustum** than the figure does at its own depth — a large Y offset that clears the figure can push the front card below the visible frame entirely. Tuned camera distance/orbit radius/centerY together and verified visually (see below) rather than by formula alone.
- Category switcher lives in normal document flow *below* the canvas, not as an absolute overlay inside it — an in-canvas overlay collided with orbiting cards at some rotations; moving it out avoids fighting 3D staging for a piece of UI that doesn't need to be "in" the scene.
- Progressive enhancement, not a hard requirement: `HeroSceneGate` renders the original flat `HeroIdentity` (Capability Signal Rail) during SSR and first paint, and only swaps to the 3D scene client-side after confirming WebGL support via `useSyncExternalStore` (avoids hydration mismatches — server and first client render always agree). No WebGL, or JS disabled → flat hero, unchanged from before. This also keeps initial HTML crawlable/indexable.
- `prefers-reduced-motion` stops auto-rotation, the figure's continuous spin/bob, and the planet's rotation (`paused` prop threaded through `SpaceBackground`/`AbstractFigure`/`OrbitRing`), but user-initiated prev/next clicks still animate — an intentional, bounded exception, consistent with how `CapabilitySignalRail` already behaved.
- The flat `SelectedWorkList` (used on `/work`) is unchanged and still the accessible/SEO-indexable listing of all projects — the 3D scene is additive on the homepage, not a replacement for the crawlable version.

**Verification method:** no browser tool is available in this environment by default, so a throwaway Playwright script was used to load the dev server, screenshot desktop (1440×900) and mobile (390×844), and read the screenshots back — this is how the figure/card overlap and switcher collision bugs above were actually caught and fixed, not guessed at. That throwaway script was later replaced with the permanent suite in `tests/` (required by brief §32 anyway): `navigation.spec.ts`, `responsive.spec.ts` (includes a no-console-errors + canvas-mounts check and a reduced-motion check), `projects.spec.ts` (world switching, nav controls, all case-study routes), `accessibility.spec.ts`. All 23 pass against a production build.

**Known real bug found and fixed via this testing:** Next.js 16's nested `not-found.tsx` only catches 404s from an explicit `notFound()` call inside an already-matched route — a genuinely unmatched path with no catch-all (e.g. `/en/typo`) fell through to Next's generic default 404 page instead of the styled one. Fixed with `src/app/[locale]/[...rest]/page.tsx` that just calls `notFound()`, forcing the path into the `[locale]` layout tree so the real `not-found.tsx` renders.

**Not yet done / left as-is deliberately:** below-the-fold sections (Across Layers, Capabilities, How I Work, Agent-native, About, Contact) were not redesigned into the space theme — they remain the calmer editorial sections from the original direction. The figure is a stylized abstract wireframe (icosahedron head, capsule limbs), not a real avatar — swap `AbstractFigure.tsx` for a `.glb` model via drei's `useGLTF` if/when a real 3D avatar exists.

---

## Positioning & hero copy (final)

- Eyebrow: `PORTFOLIO / 2026`
- Headline (unchanged from brief — strongest line, kept as-is): **"I build at the point where product, AI, code, and visual storytelling meet."**
- Role: `AI Product Builder & Creative Technologist`
- Body (tightened — the brief's six-noun list read as capability keyword-soup, which the UX pass explicitly flags as a risk):
  **"I turn rough ideas into mobile products, AI systems, generative video, and things that leave the screen as physical objects."**
- CTAs: `Selected work` / `Copy email` (text links, not filled buttons)
- Availability status line: stays **hidden** — never confirmed by the user. Configurable field, off by default.

## Homepage section order (final)

Hero → Selected Work → Across Layers → Flagship feature (Foody) → Creative/AI-video strip → How I Work → Tooling evidence → About → Contact.

Rationale: proof before framing. A visitor must see 2–3 real things before "Across Layers" reframes the breadth as one skill instead of five hobbies.

## Project inventory & depth tiers (final — revised 2026-07-10 per user decision)

**Update:** Coffydoor and Cruise Brothers are **dropped entirely** — the user does not want these video-ad client projects featured. Removed from `projects.ts`, no longer part of the site.

**Tier 1 — full case study now** (real repos, diagram-strong regardless of missing photography):
- **Foody** — flagship, `in-testing`. Anchor of the whole site. Real screenshots exist (Foody app) and will be supplied by the user.
- **AI Video Production System** — `system-design`/`prototype`. Range anchor.

**Tier 2 — lighter, compact treatment:**
- **3D Lab** — `experiment`, personal practice across **Blender, Cinema 4D, 3ds Max**, plus FDM printing "of practically anything." Real videos exist (to be supplied) — `ProjectMedia` supports a `video` kind for when footage lands. The `3D-Shop` Expo app is a separate, unrelated project (becoming its own website per the user) and is **not featured** here.

With only one compact-tier project, the "triptych" layout collapses to a single wide compact card rather than a 3-across grid — still visually distinct (smaller, one motif, no full diagram) from the two flagship cards.

**Folded into capability evidence, not standalone routes:**
- Foody Support Automation → evidence under Automation & Backend capability
- Self-Hosted Product Infrastructure → evidence under Deployment capability + "How I Work"

**Future work:** the user is actively developing further websites, apps, and games. `projects.ts` is a flat array specifically so new projects are a one-object addition, no structural rework needed.

Card layout consequence: Tier 1 gets full-bleed, bespoke `ProjectMediaFrame` diagrams (Foody's input→proxy→AI→Supabase flow; AI Video's brief→storyboard→Remotion→QA pipeline). Tier 2 (3D Lab) renders as a single compact card with one motif (the print loop) — the size difference itself communicates honesty about depth, rather than padding thin content to match card height.

## Project one-liners (final)

- **Foody** — Mobile food-inventory app with photo, receipt, and voice input, Gemini/Claude fallback — in Android testing.
- **AI Video Production System** — A designed pipeline from brief to storyboard to Remotion render — built, not yet public.
- **3D Lab** — Idea to 3D model to sliced, printed object — iteration you can hold.

## Copy fixes applied (from story-editor pass)

1. Contact line changed from *"I am most useful where..."* (unsupported comparative) to **"This is where I do my best work: product, AI, creative technology, fast execution."**
2. Workflow stage 03 restores the brief's own nuance: **"I use AI agents aggressively, not blindly."**
3. Selected-work intro: *"iterate until it works"* → **"iterate until it holds together"** (true for an experiment or a shipped product alike).
4. No literal banned phrases found in the brief's own draft — the risk was soft overclaim via lists/superlatives, now fixed above.

## Visual system (final)

- Palette: Obsidian Signal tokens as specified in the brief, unchanged.
- **Fonts (installed via `next/font/google`):**
  - Display + body: **Instrument Sans** (400/500/650/700) — one family carrying both jobs.
  - Editorial accent serif: **Instrument Serif** (400 + italic) — scoped to exactly one use across the whole site (the inverted-paper section pull-quote). Never repeated elsewhere.
  - Mono: **IBM Plex Mono** (400/500) — index numbers, status badges, stack lists, dates, coordinates.
  - Explicitly rejected: Space Grotesk + JetBrains Mono — flagged by the art-director pass as the default "AI-builder portfolio" font signature; using it would undercut the anti-template goal regardless of layout quality.

- **Hero visual (screenshot-poor launch):** Capability Signal Rail as plain markup — a 1px vertical rule with 7 mono tick labels (`PRODUCT / MOBILE / AI / VIDEO / 3D / AUTOMATION / DEPLOY`), one active at a time (auto-advance ~8s, pauses on hover/focus, advances on scroll), active state = 2px signal-yellow marker + brightened segment + fading-in mono proof fragment (e.g. `Expo / React Native / Supabase`). No icons, no carousel chrome. `prefers-reduced-motion`: static, first node active, all ticks visible, no auto-advance.

- **Diagram grammar:** each custom graphic gets its own shape language tied to its subject — flow lines (Foody, AI Video pipeline), matrix grid (Coffydoor continuity), circular loop (3D Lab print cycle), timeline (How I Work). Never one component reskinned five times — that reads as a slide deck.

## Top anti-template risks tracked

1. **Diagram fatigue** — mitigated by distinct shape grammar per diagram (above).
2. **Font-combo cliché** — mitigated by Instrument Sans/Serif + IBM Plex Mono instead of Space Grotesk/JetBrains Mono.
3. **Overcompensating for the screenshot gap with density** — every section gets one dominant graphic idea and generous negative space; restraint is the signal that the site is designed on purpose, not filling gaps.

## Engineering notes

- Next.js 16.2.10 — `params`/`searchParams` are Promises everywhere (page/layout/route/metadata/icon generators); always `await`. `middleware.ts` → `proxy.ts`. `turbopack` is a top-level config key. Use `next/image` `remotePatterns`, not deprecated `domains`.
- Server Components by default; Client Components only for the signal rail, language switch, copy-email button, and mobile menu.
