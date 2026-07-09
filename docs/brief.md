# CLAUDE MASTER INSTRUCTION
# Premium Portfolio Website for Serega Tarasyuk
# Version: 2026-07-10

> This file is the single source of truth for Claude Code.
> Build the website as a serious production portfolio, not as a template, demo, AI landing page, or generic developer CV.
> The goal is simple: a recruiter, founder, creative director, product lead, or technical hiring manager should open the site and immediately think:
>
> **“This person can turn ideas into real products, systems, visuals, and shipped outcomes.”**

---

## 0. EXECUTION MODE — READ THIS FIRST

You are not only a coding assistant. For this project, act as a small senior digital studio coordinated by the main Claude Code session.

Before implementing the website:

1. Read this entire file.
2. Inspect the repository.
3. Inspect existing assets if any.
4. Create the project-level Claude Code subagents defined in this document under `.claude/agents/`.
5. Create the project-level skills defined in this document under `.claude/skills/`.
6. Delegate the relevant analysis to the subagents.
7. Make them critique one another where useful.
8. Synthesize one coherent direction.
9. Implement in phases.
10. Run the site.
11. Verify it visually on multiple viewport sizes.
12. Fix visual, responsive, accessibility, performance, and content issues before calling the work complete.

### Critical behavior

- Do not wait for the user to micromanage each section.
- Do not ask repeated questions when a safe professional decision can be made from this specification.
- Do not invent career history, metrics, years of experience, employers, revenue, downloads, client results, or awards.
- Do not present concepts as shipped products.
- Do not use fake testimonials.
- Do not use fake “trusted by” logos.
- Do not use random stock portraits as if they were Serega.
- Do not use AI-generated filler imagery merely to make the site look full.
- Do not use a generic SaaS template.
- Do not use a generic “developer portfolio” template with floating skill pills and progress bars.
- Do not use a generic neon cyberpunk theme.
- Do not use excessive glassmorphism.
- Do not use giant glowing blobs.
- Do not use meaningless 3D spheres.
- Do not use a Matrix-style terminal aesthetic.
- Do not use “AI magic”, “revolutionary”, “10x”, “ninja”, “guru”, “rockstar”, or inflated claims.
- Do not expose implementation secrets, API keys, private client data, unpublished assets, or sensitive project information.
- Never claim a project is live if it is not verified as live.

The website must feel authored, deliberate, expensive, editorial, technically mature, and personal.

---

# 1. PERSON / POSITIONING

## 1.1 Public identity

Use a central data file so the information can be changed once:

```ts
export const profile = {
  name: "Serega Tarasyuk",
  handle: "@mrtarasyuks",
  email: "mrtarasyuks@gmail.com",
  location: "Ukraine",
};
```

Do not invent phone number, LinkedIn URL, GitHub URL, CV URL, company name, or other contact details.

If links are missing:
- hide the corresponding UI;
- do not render dead placeholder links;
- leave a clearly documented TODO in the content configuration.

## 1.2 Core professional positioning

The site must **not** position Serega as only a frontend developer.

Primary positioning:

> **AI Product Builder / Creative Technologist**

Supporting positioning:

> I turn rough ideas into working products, AI-powered experiences, visual systems, automation, and deployable software.

Alternative concise line for smaller screens:

> Products. AI systems. Visual stories. Shipped fast.

Professional identity to communicate through evidence:

- AI Product Builder
- Creative Technologist
- Vibe Coder with strong product ownership
- Mobile Product Builder
- AI Workflow Designer
- AI Video / Generative Production Specialist
- Product-minded prototyper
- Automation and integration builder
- 3D maker / Blender and FDM workflow practitioner
- Self-hosting and deployment practitioner

### Important nuance

Do not frame “vibe coding” as careless code generation.

Frame it as:

> High-velocity product development using AI coding agents, structured project memory, iterative verification, real backend services, source control, and deployment workflows.

The site should show that Serega:
- starts from the problem;
- defines UX and product logic;
- uses AI agents to accelerate execution;
- iterates aggressively;
- connects real infrastructure;
- tests;
- ships;
- learns quickly across disciplines.

---

# 2. PERSONAL BRAND STRATEGY

## 2.1 Brand idea

Use the concept:

# **BUILDING ACROSS LAYERS**

Serega operates across multiple layers of modern product creation:

```text
IDEA
↓
PRODUCT LOGIC
↓
UX / UI
↓
AI WORKFLOW
↓
CODE
↓
MEDIA
↓
INFRASTRUCTURE
↓
DEPLOYMENT
↓
ITERATION
```

This is the narrative spine of the portfolio.

The visitor should understand:

> “He is unusually strong at crossing boundaries between product, AI, code, design, content, media, 3D, and deployment.”

## 2.2 Brand tone

Tone must be:
- confident;
- precise;
- direct;
- curious;
- inventive;
- practical;
- slightly provocative;
- never corporate-boring;
- never arrogant.

Use short, strong sentences.

Good:

> I build at the point where product, AI, code, and visual storytelling meet.

> I do not stop at mockups. I push ideas into working systems.

> My edge is range — and the ability to connect that range into one product.

Bad:

> Passionate developer with a proven track record of delivering cutting-edge innovative solutions.

Bad:

> I leverage state-of-the-art AI to revolutionize digital experiences.

---

# 3. DESIGN DIRECTION

## 3.1 Overall concept

Create a premium **editorial-industrial digital studio** aesthetic.

Think:
- high-end creative technology studio;
- modern product lab;
- art direction from an independent design agency;
- strong Swiss/editorial grid;
- subtle industrial instrumentation;
- premium motion;
- real project imagery;
- custom composition;
- controlled imperfection.

Do **not** imitate any single existing site.

The result should feel:
- custom;
- expensive;
- highly intentional;
- contemporary in 2026;
- not trend-chasing;
- not like a component library demo.

## 3.2 Visual concept name

Internal design concept:

# **OBSIDIAN SIGNAL**

### Core palette

```css
--bg: #0A0A0B;
--bg-elevated: #111113;
--surface: #151518;
--surface-soft: #1B1B1F;

--paper: #F2F0EA;
--paper-muted: #D8D5CD;

--text: #F5F3ED;
--text-muted: #A6A5A1;
--text-dim: #737373;

--signal: #FFD21F;
--signal-soft: #E9C524;
--signal-ink: #151300;

--line: rgba(255,255,255,0.12);
--line-strong: rgba(255,255,255,0.22);
```

The yellow is a **signal**, not a wallpaper.

Use it:
- for focus;
- active states;
- tiny labels;
- one important CTA;
- selected project index;
- motion markers;
- graphic separators.

Do not flood every section with yellow.

### Optional light editorial section

One or two sections may invert to:

```css
background: #F2F0EA;
color: #111113;
```

This contrast can make the long page feel art-directed rather than monotonous.

## 3.3 Typography

Typography must carry the design.

Recommended direction:
- primary sans: **Instrument Sans**, **Manrope**, or another high-quality variable sans available in the project;
- technical mono: **IBM Plex Mono** or **JetBrains Mono**;
- avoid using more than 2 primary font families;
- no decorative display font unless the art director agent proves it improves the system.

Rules:
- large headlines with tight but readable tracking;
- editorial line breaks;
- strong difference between display, section titles, body, and metadata;
- use mono for coordinates, project index, stack, status, dates, and system labels;
- no tiny unreadable 10px text;
- body text must remain comfortable on mobile.

## 3.4 Grid

Desktop:
- 12-column grid;
- max content width approximately 1440px;
- generous outer margins;
- intentional asymmetry.

Tablet:
- 8-column grid.

Mobile:
- 4-column grid;
- no desktop layout squeezed into a phone.

Use visible grid logic without literally drawing a grid everywhere.

## 3.5 Surface treatment

Allowed:
- thin structural lines;
- subtle grain;
- masked image reveals;
- high-contrast editorial crops;
- soft inner highlights;
- restrained blur;
- subtle depth;
- deliberate dark surfaces.

Avoid:
- 30 identical rounded cards;
- 24px radius on everything;
- endless glass panels;
- heavy drop shadows;
- excessive gradients.

Different components should have different structural roles.

## 3.6 Shape language

Use:
- mostly squared or slightly softened corners;
- 2px–14px radii depending on purpose;
- strong edge alignment;
- occasional large radius only where it has meaning.

Do not make every element a pill.

## 3.7 Image direction

Priority:
1. real screenshots;
2. real UI frames;
3. real storyboard frames;
4. real product visuals;
5. real 3D / Blender / print photos;
6. real code / infrastructure diagrams created specifically for the portfolio.

Do not:
- fill case studies with fake stock photos;
- generate fake screenshots;
- fabricate app screens;
- show copyrighted client work without available permission/assets.

When project media is missing:
- create a sophisticated abstract project cover from typography, system diagrams, UI fragments, and truthful metadata;
- mark it as a designed case-study cover, not a screenshot.

---

# 4. MOTION DIRECTION

Motion is required, but it must be premium and purposeful.

Use Motion for React where appropriate.

## 4.1 Motion principles

- motion communicates hierarchy;
- motion shows relationship;
- motion reveals process;
- motion should never delay reading;
- motion should never become a demo reel of animation tricks.

Recommended:
- masked text reveals;
- gentle parallax;
- image crop transitions;
- section index transitions;
- hover state with 2–6px positional response;
- project card media scale around 1.015–1.04, not 1.2;
- shared layout transitions where meaningful;
- a subtle “signal line” moving across key transitions;
- scroll progress as a structural indicator;
- sticky case-study storytelling where appropriate.

Avoid:
- typewriter hero text;
- bouncing buttons;
- constant floating icons;
- continuous spinning;
- large mouse-following glow;
- scroll hijacking;
- long entrance animations;
- excessive stagger.

## 4.2 Reduced motion

Respect `prefers-reduced-motion`.

When reduced motion is enabled:
- remove parallax;
- remove large transforms;
- remove continuous loops;
- keep content immediately readable.

## 4.3 Mobile motion

Mobile animation must be lighter than desktop.

No hover-dependent meaning.

---

# 5. HERO — THE FIRST 8 SECONDS

The hero must immediately differentiate Serega.

## 5.1 Desktop composition

Possible structure:

```text
[01 / PORTFOLIO 2026]                     [UKRAINE / AVAILABLE FOR...]

SEREGA
TARASYUK

AI PRODUCT BUILDER
& CREATIVE TECHNOLOGIST

I turn rough ideas into working products,
AI systems, visual stories, and deployable software.

[VIEW SELECTED WORK]   [COPY EMAIL]

                    [animated capability rail / system map]
```

But do not implement this literally without the art director reviewing composition.

## 5.2 Hero signature interaction

Create one memorable original interaction.

Recommended concept:

### **Capability Signal Rail**

A horizontal or vertical system rail with 5–7 nodes:

```text
PRODUCT
MOBILE
AI
VIDEO
3D
AUTOMATION
DEPLOY
```

As the rail moves slowly or responds to pointer/scroll:
- one capability becomes active;
- a short proof fragment appears;
- the visual remains abstract and editorial.

Examples:

```text
MOBILE
Expo / React Native / Supabase

AI
Gemini / Claude / vision / voice / fallback logic

VIDEO
Veo / Kling / Remotion / storyboard systems

DEPLOY
GitHub / Coolify / Hetzner / Cloudflare
```

It must not look like a carousel component.

## 5.3 Hero copy options

Primary recommended:

> **I build at the point where product, AI, code, and visual storytelling meet.**

Secondary:

> From mobile apps and AI workflows to cinematic content, automation, 3D, and self-hosted deployment.

CTA:
- `Selected work`
- `Copy email`

Small status:
- `Open to strong product, AI and creative-tech opportunities`

Do not claim immediate availability unless user later confirms it. The wording above can be kept as a configurable content field and hidden if not confirmed.

---

# 6. SITE INFORMATION ARCHITECTURE

Recommended routes:

```text
/
 /work
 /work/foody
 /work/ai-video-production
 /work/coffydoor
 /work/cruise-brothers
 /work/3d-lab
 /about
```

Optional only when assets justify it:

```text
/lab
```

Do not create empty routes.

## Home page sections

1. Hero
2. Selected Work
3. “Across Layers” capability system
4. Flagship case-study feature
5. Creative technology / AI video strip
6. How I work
7. Tooling / stack as evidence, not keyword soup
8. Short about block
9. Final contact
10. Minimal footer

---

# 7. CONTENT TRUTH MODEL

Every project must have a status.

Use this type:

```ts
export type ProjectStatus =
  | "shipped"
  | "in-testing"
  | "prototype"
  | "concept"
  | "client-work"
  | "system-design"
  | "experiment";
```

UI labels:

```text
SHIPPED
IN TESTING
PROTOTYPE
CONCEPT
CLIENT WORK
SYSTEM DESIGN
EXPERIMENT
```

Never upgrade status without evidence.

Project data should include:

```ts
type PortfolioProject = {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  status: ProjectStatus;
  role: string[];
  oneLine: string;
  summary: string;
  challenge?: string;
  approach?: string[];
  outcomes?: string[];
  stack?: string[];
  capabilities?: string[];
  media?: ProjectMedia[];
  links?: ProjectLink[];
  confidentialityNote?: string;
  verificationNote?: string;
};
```

## Critical honesty rule

If exact metrics are unknown:
- do not invent them;
- use qualitative outcomes;
- use architecture;
- use complexity;
- use process evidence;
- use shipped functionality;
- use verified status.

---

# 8. PROJECT CONTENT — USE AS THE INITIAL CONTENT INVENTORY

The following content is based on Serega’s known work and project history.

Before publishing:
- inspect repository assets;
- inspect project files;
- use evidence available locally;
- downgrade or hide any claim that cannot be supported.

---

## PROJECT A — FOODY

### Title

**Foody — AI Food & Home Inventory Product**

### Priority

This is the flagship technical/product case study.

### Safe positioning

A mobile product built around food inventory, AI-assisted analysis, recipes, shopping, nutrition-related experiences, voice/photo input, and personal utility workflows.

### Known technical direction

- Expo / React Native
- TypeScript strict mode
- React Navigation
- Supabase
  - Auth
  - PostgreSQL
  - Storage
- Supabase Edge Functions
- server-side AI proxy pattern
- Gemini as primary provider in known project architecture
- Claude fallback architecture
- image input
- receipt analysis
- fridge/product analysis
- AI chef / chat workflows
- recipes
- shopping list
- calorie-related features
- voice analysis / audio input in project evolution
- localization
- dark/light theme
- secure local auth storage
- mobile widgets work exists in project history; publishing status must be represented carefully
- Google Play testing activity exists in project history; do not claim public production launch unless verified

### Product story

The case study should emphasize that this is not “a chat wrapper.”

Show the product system:

```text
USER INPUT
  ├─ photo
  ├─ receipt
  ├─ voice
  └─ text
        ↓
MOBILE UX
        ↓
SERVER-SIDE AI PROXY
        ↓
MODEL ROUTING / FALLBACK
        ↓
STRUCTURED RESULT
        ↓
SUPABASE DATA
        ↓
PERSONALIZED PRODUCT EXPERIENCE
```

### Case-study narrative

#### Challenge

Food and home inventory data is messy:
- users do not want to type everything;
- images are imperfect;
- receipts are inconsistent;
- AI can be wrong;
- nutrition and food safety need careful wording;
- mobile UX must remain fast and understandable.

#### Approach

Highlight:
- camera-first workflows;
- structured AI actions;
- server-side key protection;
- fallback model thinking;
- meaningful empty/loading/error states;
- user profile context;
- dietary restrictions and preferences where applicable;
- feature iteration;
- multilingual product considerations;
- app-store readiness work;
- legal and AI disclaimers;
- practical product architecture.

#### Evidence blocks

Possible visual blocks:
- app UI screen mosaic;
- architecture diagram;
- “input → AI → structured output” flow;
- project evolution timeline;
- feature topology;
- code/infrastructure metadata;
- before/after UX iterations.

### Suggested role tags

```text
Product Strategy
UX Logic
AI Integration
Mobile Development
Supabase Architecture
Prompt / Output Design
Iteration
Release Preparation
```

### Suggested status

Use `in-testing` unless current repository evidence proves a different status.

### Do not claim

- public store launch unless verified;
- user count;
- revenue;
- medical accuracy;
- nutritionist certification;
- AI accuracy percentage;
- App Store launch unless verified.

---

## PROJECT B — AI VIDEO PRODUCTION SYSTEM / STUDIOVERSE

### Title

**AI Video Production System**

Optional subtitle:

> From creative brief to storyboard, generation workflow, motion graphics, QA, and delivery.

### Status

Use `system-design` or `prototype` depending on verified implementation.

### Story

Serega has designed workflows and project architecture around AI-assisted promo/video production.

Known system direction includes:
- structured creative brief;
- user order flow;
- Supabase order storage;
- agent pipeline thinking;
- storyboard stage;
- shot planning;
- image/video prompt stages;
- music stage;
- Remotion motion graphics;
- FFmpeg processing;
- background worker architecture for long-running jobs;
- QA stage;
- final delivery.

### Strong visual

Create a custom process map:

```text
BRIEF
  ↓
ANALYSIS
  ↓
CONCEPT
  ↓
STORYBOARD
  ↓
SHOT SYSTEM
  ↓
IMAGE / VIDEO GENERATION
  ↓
MOTION / REMOTION
  ↓
AUDIO
  ↓
RENDER
  ↓
QA
  ↓
DELIVERY
```

Make this one of the most visually memorable sections.

### Role tags

```text
Product Architecture
Agent Workflow Design
Creative Direction
Prompt Systems
Remotion
AI Video
Pipeline Design
```

### Important honesty rule

Do not claim the full autonomous platform is production-live unless verified.

---

## PROJECT C — COFFYDOOR

### Title

**Coffydoor — Continuity-First AI Ad Production**

### Status

`client-work`

### Known project evidence

A storyboard exists for a vertical doorbell-camera ad.

The work includes:
- 9:16 social format;
- single-location continuity;
- fixed doorbell/security-camera POV;
- character consistency;
- product label consistency;
- precise blocking;
- shot-by-shot prompt design;
- client approval / notes workflow in storyboard material;
- CTA/end-card decision management.

### Case-study angle

Do not present this as “I typed a prompt and AI made a video.”

Present it as:

> **Generative production under continuity constraints.**

Show the complexity:
- same camera;
- same location;
- same characters;
- same product;
- correct label;
- no accidental eye contact;
- consistent staging;
- controlled narrative progression.

### Suggested visual

Create a “continuity matrix” with rows:

```text
CAMERA
LOCATION
CHARACTER
WARDROBE
PRODUCT
LABEL
BLOCKING
LIGHT
```

and columns for representative shots.

This makes the craft legible to recruiters.

### Role tags

```text
Creative Direction
Storyboard
Prompt Engineering
Continuity Design
AI Video Workflow
Client Communication
```

### Confidentiality

Use only assets available in the repository or explicitly public/approved material.

---

## PROJECT D — CRUISE BROTHERS / NORWAY & ICELAND

### Title

**Cruise Brothers — 15s Motion Sales Creative**

### Status

`client-work` or `prototype` based on evidence.

### Known direction

- 15-second vertical ad;
- 1080×1920;
- 30fps;
- Remotion;
- premium travel aesthetic;
- route animation;
- destination storytelling;
- pricing hierarchy;
- CTA;
- source material analysis;
- conversion-focused pacing.

### Case-study angle

> Turning a dense travel offer into a mobile-first 15-second sales narrative.

### Show

- source complexity;
- information prioritization;
- storyboard timing;
- route animation system;
- mobile readability;
- CTA hierarchy.

### Role tags

```text
Creative Strategy
Information Hierarchy
Motion Design
Remotion
Ad Storytelling
Conversion Thinking
```

Do not publish client phone numbers or commercial details unless the asset is already public and explicitly intended for the case study.

---

## PROJECT E — CINEMATIC GENERATIVE STORYTELLING / ELVIS SCENE

### Title

**Cinematic Continuity Experiment — 38-Shot AI Scene**

### Status

`experiment`

### Positioning

A complex multi-shot generative filmmaking exercise focused on:
- character identity continuity;
- 1960s studio look;
- shot grammar;
- 180-degree rule awareness;
- OTS / CU / master coverage;
- wardrobe consistency;
- character gaze;
- blocking;
- performance direction;
- iterative prompt correction.

### Strong case-study angle

> Generative video becomes difficult when a scene must behave like cinema rather than a sequence of unrelated clips.

Show:
- shot map;
- camera axis diagram;
- continuity problems;
- iteration examples;
- prompt refinement logic.

### Do not overclaim

Do not imply affiliation with Elvis Presley’s estate, film studios, or rights holders.

Add a clear experiment/editorial note where required.

---

## PROJECT F — 3D LAB

### Title

**3D Design & Fabrication Lab**

### Status

Use `experiment`, `prototype`, or `shipped` per individual item.

### Known working areas

- Blender
- 3D modeling workflows
- preparing models for print
- FDM printing
- Bambu Studio workflow
- support / geometry iteration
- print-speed optimization
- slicing
- G-code-related practical adjustments
- multi-part / multi-color object considerations
- product-oriented 3D ideas
- custom lamps / custom print product thinking

### Case-study angle

> I like products that leave the screen.

This line can be used.

Show the loop:

```text
IDEA
↓
MODEL
↓
GEOMETRY CHECK
↓
SLICE
↓
PRINT
↓
FAILURE
↓
ADJUST
↓
PHYSICAL RESULT
```

### Role tags

```text
Blender
3D Modeling
FDM
Rapid Prototyping
Slicing
Physical Iteration
```

Do not claim professional industrial engineering credentials.

---

## PROJECT G — FOODY SUPPORT AUTOMATION

### Title

**AI-Assisted Telegram Support Workflow**

### Status

`prototype` or `system-design` unless verified deployed.

### Known architecture

```text
TELEGRAM
↓
WEBHOOK
↓
CLOUDFLARE WORKER
├─ forward to admin
└─ AI support response
        ↓
      USER
```

Known design considerations:
- TypeScript / JavaScript worker direction;
- secrets in environment;
- webhook secret;
- Claude API support assistant;
- language-aware answers;
- escalation of billing/account/privacy/bug issues;
- do not request sensitive user data.

### Angle

> Small system, real operational thinking.

---

## PROJECT H — SELF-HOSTED PRODUCT INFRASTRUCTURE

### Title

**Self-Hosted Product Infrastructure**

### Status

`shipped` only for components verified deployed; otherwise `system-design`.

### Known stack direction

```text
CLAUDE CODE / CODEX
        ↓
      GITHUB
        ↓
      COOLIFY
        ↓
      HETZNER
        ↓
   DOMAIN / SERVICE
```

Supporting tools:
- Ubuntu server workflow
- Cloudflare
- apps
- APIs
- Telegram bots
- webhooks
- cron jobs
- PostgreSQL
- Redis where needed

### Angle

> From local AI-assisted development to push-to-deploy infrastructure.

This is important because it shows Serega does not stop at frontend prototypes.

---

# 9. SKILLS / CAPABILITIES — DO NOT USE PERCENTAGE BARS

No:
- React 95%
- AI 90%
- Blender 80%

Instead create a capability system with evidence.

## Capability Group 1 — Product & UX

Evidence:
- feature architecture;
- onboarding thinking;
- mobile workflows;
- empty/error states;
- monetization thinking;
- premium feature boundaries;
- release readiness;
- app-store constraints;
- iterative user feedback.

Label:

> **Product systems, not isolated screens**

## Capability Group 2 — Mobile

Evidence:
- Expo;
- React Native;
- TypeScript;
- navigation;
- OTA updates;
- Supabase;
- mobile permissions;
- image/audio input;
- widgets work;
- responsive mobile UI.

Label:

> **Mobile products from interaction to backend**

## Capability Group 3 — AI Integration

Evidence:
- Claude;
- Gemini;
- prompt systems;
- structured outputs;
- fallback logic;
- server-side proxy;
- vision;
- voice;
- image analysis;
- context-aware workflows.

Label:

> **AI as product infrastructure**

## Capability Group 4 — Generative Media

Evidence:
- Veo;
- Kling;
- Runway where verified;
- Nano Banana / image generation tools where verified;
- storyboards;
- continuity;
- shot design;
- prompting;
- visual QA;
- voiceover workflows;
- AI music workflows;
- Remotion.

Label:

> **Generative media with production discipline**

## Capability Group 5 — Automation & Backend

Evidence:
- Supabase;
- Edge Functions;
- Cloudflare Workers;
- webhooks;
- Telegram bots;
- APIs;
- scheduled workflows where applicable.

Label:

> **Small systems that remove manual work**

## Capability Group 6 — Deployment

Evidence:
- GitHub;
- Hetzner;
- Coolify;
- Cloudflare;
- Docker-compatible deployment thinking;
- push-to-deploy.

Label:

> **I care about the path to production**

## Capability Group 7 — 3D / Physical

Evidence:
- Blender;
- FDM;
- Bambu Studio;
- slicing;
- supports;
- physical iteration.

Label:

> **From pixels to physical objects**

---

# 10. “HOW I WORK” SECTION

This section must feel honest and specific.

Recommended title:

# **My operating system**

Create 5 stages.

## 01 — Find the real problem

> I reduce a vague idea to one useful user action and one clear outcome.

## 02 — Build the system, not only the screen

> I map data, states, edge cases, AI behavior, backend boundaries, and the path to deployment.

## 03 — Use agents aggressively, not blindly

> Claude Code, Codex, and specialized AI workflows accelerate execution. Project memory, constraints, review, and verification keep the work coherent.

## 04 — Iterate in public reality

> Real devices, real API limits, weird edge cases, store requirements, broken generations, and failed prints are part of the process.

## 05 — Ship, observe, refine

> Push, deploy, test, collect feedback, fix what matters, repeat.

Use a strong visual timeline or pinned sequence.
Do not make five generic feature cards.

---

# 11. AI-ASSISTED DEVELOPMENT WORKFLOW SECTION

This is a differentiator and should be explicit.

Suggested title:

# **Agent-native, product-led**

Explain the known workflow:

```text
PRODUCT INTENT
↓
STRUCTURED PROJECT MEMORY
↓
CLAUDE CODE / CODEX
↓
IMPLEMENTATION
↓
LOCAL REVIEW
↓
REAL DEVICE / BROWSER CHECK
↓
GIT
↓
DEPLOY
↓
FEEDBACK
↓
NEXT ITERATION
```

Mention carefully:
- long-running project context in `CLAUDE.md`;
- staged implementation;
- starting fresh sessions to manage context;
- Git-based workflow;
- Expo EAS Update for suitable JS/asset changes where relevant;
- verification rather than trusting the first generated result.

Do not expose private project contents.

Possible copy:

> I use AI coding agents as a development environment, not a one-shot code generator. I keep project memory, split work into stages, review behavior, and push changes through a real Git and deployment workflow.

---

# 12. ABOUT SECTION

Keep it short.

Recommended copy direction:

> I am a multidisciplinary builder from Ukraine working across AI products, mobile apps, generative media, automation, and 3D.
>
> I learn by building. A product problem may take me from UX logic to Supabase, from a camera workflow to an AI proxy, from a storyboard to a generative video pipeline, or from Blender to a physical print.
>
> The common thread is simple: I like turning vague ideas into systems that work.

Optional final line:

> I am especially interested in roles where product thinking, AI, creative technology, and fast execution overlap.

Do not write a long autobiography.

---

# 13. CONTACT SECTION

The final contact must feel like a conclusion, not a form template.

Suggested heading:

# **Have a hard idea? Good.**

Body:

> Product, AI, mobile, creative technology, generative media, automation — I am most useful where the boundaries are still unclear.

Actions:
- `Email me`
- `Copy email`

Known email:

```text
mrtarasyuks@gmail.com
```

Handle:

```text
@mrtarasyuks
```

Only render handle as a clickable link if a verified URL is configured.

---

# 14. LANGUAGE

Build:
- English as default;
- Ukrainian as second locale.

Use a restrained language switch:
- `EN`
- `UA`

Do not rely on automatic machine translation at runtime.

Store content structurally.

Suggested:

```text
src/content/en.ts
src/content/uk.ts
```

or:

```text
src/content/portfolio.ts
```

with localized fields.

Do not make language switching cause layout shift.

---

# 15. TECH STACK

Use a modern production stack.

Recommended:

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS v4
- Motion for React
- next/image
- next/font or locally hosted production-safe fonts
- Zod for typed validation where needed
- Playwright for responsive and interaction verification
- ESLint
- package lock committed

Use current stable package versions available at implementation time.
Do not blindly pin versions written in this document if the project already has a valid newer compatible stack.

### Current architectural preference

Prefer:
- Server Components for static/project content;
- Client Components only where interaction is needed;
- content-driven project pages;
- minimal runtime JavaScript;
- no unnecessary global state library;
- no database for portfolio content unless there is a real requirement;
- no CMS in v1.

---

# 16. REPOSITORY STRUCTURE

Recommended:

```text
portfolio/
├─ app/
│  ├─ [locale]/
│  │  ├─ page.tsx
│  │  ├─ work/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/
│  │  │     └─ page.tsx
│  │  └─ about/
│  │     └─ page.tsx
│  ├─ api/
│  │  └─ health/
│  │     └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ opengraph-image.tsx
├─ components/
│  ├─ layout/
│  ├─ hero/
│  ├─ work/
│  ├─ case-study/
│  ├─ capabilities/
│  ├─ motion/
│  ├─ ui/
│  └─ graphics/
├─ content/
│  ├─ profile.ts
│  ├─ projects.ts
│  ├─ capabilities.ts
│  └─ localized-copy.ts
├─ lib/
│  ├─ seo.ts
│  ├─ motion.ts
│  ├─ cn.ts
│  └─ project-status.ts
├─ public/
│  ├─ work/
│  │  ├─ foody/
│  │  ├─ ai-video/
│  │  ├─ coffydoor/
│  │  ├─ cruise/
│  │  └─ 3d/
│  ├─ og/
│  └─ textures/
├─ tests/
│  ├─ responsive.spec.ts
│  ├─ navigation.spec.ts
│  ├─ projects.spec.ts
│  └─ accessibility.spec.ts
├─ .claude/
│  ├─ agents/
│  ├─ skills/
│  └─ settings.json
├─ Dockerfile
├─ .dockerignore
├─ .env.example
├─ CLAUDE.md
├─ README.md
└─ package.json
```

Adapt to the actual project rather than mechanically duplicating directories.

---

# 17. COMPONENT SYSTEM

Do not build a generic component library first.

Build only components justified by the portfolio.

Suggested:

```text
SiteHeader
MobileMenu
HeroIdentity
CapabilitySignalRail
SectionIndex
SelectedWorkList
ProjectFeature
ProjectMediaFrame
ProjectStatusBadge
ProjectMeta
CaseStudyHero
CaseStudyNarrative
ArchitectureDiagram
ContinuityMatrix
ProcessTimeline
ToolEvidenceRail
ContactClosing
LanguageSwitch
CopyEmailButton
```

## UI primitives

Keep primitives low-level:
- Button
- Link
- Container
- Grid
- Text
- MediaFrame
- Divider

Do not over-abstract.

---

# 18. PROJECT CARD DESIGN

A selected-work card should not look like a SaaS pricing card.

Recommended anatomy:

```text
[PROJECT INDEX] [STATUS] [YEAR]

LARGE PROJECT TITLE

One precise sentence.

[full-bleed media / custom cover]

ROLE                    STACK
Product / AI / Mobile   Expo / Supabase / ...

[OPEN CASE STUDY →]
```

Alternate left/right composition by project.
Avoid identical repeated cards.

Desktop cards may use:
- 5/7 split;
- 7/5 split;
- full-width editorial break.

Mobile:
- single column;
- keep metadata compact;
- media first or title first based on hierarchy.

---

# 19. CASE STUDY TEMPLATE

Every case study should answer:

1. What was the problem?
2. What did Serega own?
3. What made it difficult?
4. How was the system structured?
5. What decisions mattered?
6. What is actually built / tested / conceptual?
7. What did he learn?

Suggested structure:

```text
CASE HERO

PROJECT SNAPSHOT
- status
- role
- year
- stack

CONTEXT

THE HARD PART

SYSTEM / APPROACH

SELECTED DECISIONS

VISUAL EVIDENCE

EDGE CASES / CONSTRAINTS

OUTCOME

WHAT I WOULD DO NEXT
```

This last section is valuable because some projects are evolving.

---

# 20. CUSTOM GRAPHICS TO BUILD

Create custom graphics in code where they add meaning.

## 20.1 Foody architecture diagram

Show:
- mobile inputs;
- server proxy;
- AI providers;
- structured actions;
- Supabase;
- product UI.

## 20.2 AI video pipeline

Show:
- brief;
- agents;
- storyboard;
- generation;
- motion;
- audio;
- QA;
- output.

## 20.3 Coffydoor continuity matrix

Show:
- camera;
- location;
- character;
- product;
- label;
- light;
- blocking.

## 20.4 Agent-native development loop

Show:
- intent;
- context;
- agent;
- code;
- verify;
- Git;
- deploy;
- feedback.

## 20.5 3D physical iteration loop

Show:
- model;
- slice;
- print;
- inspect;
- adjust.

These should be custom SVG/CSS/React graphics.
Do not use generic icon packs as the primary visual language.

---

# 21. RESPONSIVE DESIGN REQUIREMENTS

The website must be intentionally designed for:
- small phones;
- large phones;
- tablets portrait;
- tablets landscape;
- laptops;
- desktops;
- ultrawide screens.

Minimum verification viewports:

```text
320 × 568
360 × 800
390 × 844
430 × 932
768 × 1024
1024 × 768
1280 × 800
1440 × 900
1920 × 1080
```

## Mobile rules

- no horizontal overflow;
- no text clipped by viewport;
- no section depends on hover;
- no 100vh trap behind mobile browser chrome;
- use `dvh` carefully;
- hero headline must not become absurdly large;
- tap targets must be comfortable;
- sticky elements must not consume the entire screen;
- project media aspect ratios may change for mobile;
- metadata can stack;
- navigation must be reachable one-handed;
- language switch must remain visible but unobtrusive.

## Tablet rules

Do not treat tablets as large phones.

Build intentional 2-column or 8-column layouts where appropriate.

## Ultrawide rules

Do not allow paragraphs to become too wide.
Keep readable line length and controlled max widths.

---

# 22. ACCESSIBILITY

Required:

- semantic landmarks;
- one logical `h1`;
- heading hierarchy;
- keyboard navigation;
- visible focus states;
- sufficient contrast;
- meaningful alt text;
- empty alt for decorative images;
- no information available only by color;
- skip link;
- reduced-motion support;
- buttons are buttons;
- links are links;
- no clickable divs;
- correct aria labels for icon-only controls.

Use automated accessibility checks where possible, but do not assume automation catches everything.

---

# 23. PERFORMANCE

This site must feel premium because it is fast.

Targets:
- excellent mobile performance;
- no huge video autoplay above the fold;
- no unoptimized images;
- no unnecessary client-side hydration;
- no 3D library unless clearly justified;
- lazy-load below-fold media;
- use responsive image sizes;
- avoid layout shifts;
- keep animation work on transform/opacity where possible;
- avoid expensive scroll listeners.

Define a performance budget in README.

Recommended:
- initial page JS kept restrained;
- hero does not require a heavyweight canvas engine;
- project videos use poster images and user-controlled playback;
- do not preload everything.

---

# 24. SEO / SHARING

Implement:
- title;
- description;
- canonical handling;
- sitemap;
- robots;
- Open Graph;
- Twitter/X card metadata;
- project-specific metadata;
- JSON-LD where truthful.

Possible homepage title:

```text
Serega Tarasyuk — AI Product Builder & Creative Technologist
```

Possible description:

```text
Portfolio of Serega Tarasyuk — AI products, mobile apps, generative video systems, automation, 3D workflows, and production-minded deployment.
```

Structured data:
- `Person`
- `WebSite`
- `CreativeWork` for case studies where appropriate

Do not add fake employer or award data.

---

# 25. CLAUDE CODE MULTI-AGENT SETUP

Claude Code supports project-level custom subagents. Create these files under:

```text
.claude/agents/
```

The main agent must explicitly delegate relevant work.

---

## 25.1 `.claude/agents/brand-art-director.md`

```md
---
name: brand-art-director
description: Senior digital art director for premium non-template portfolio design. Use for brand direction, visual system, composition, typography, color, image treatment, and anti-generic critique.
model: inherit
---

You are the senior art director for Serega Tarasyuk's portfolio.

Your goal is to create a distinctive, expensive, editorial-industrial creative technology identity.

Core concept:
- OBSIDIAN SIGNAL
- dark obsidian base
- warm paper contrast
- signal yellow used sparingly
- editorial grid
- industrial precision
- real project evidence
- premium restrained motion

You must aggressively reject:
- generic SaaS layouts
- generic developer portfolios
- endless rounded cards
- meaningless glassmorphism
- neon cyberpunk
- AI glowing blobs
- excessive gradients
- random 3D spheres
- template hero sections
- skill percentage bars
- fake testimonials

For every design proposal:
1. Explain the visual hierarchy.
2. Explain why it fits this person.
3. Identify template-like risks.
4. Check typography.
5. Check spacing rhythm.
6. Check mobile adaptation.
7. Recommend specific corrections.

You are a critic before you are a decorator.
Do not write production code unless explicitly asked.
```

---

## 25.2 `.claude/agents/ux-portfolio-architect.md`

```md
---
name: ux-portfolio-architect
description: Senior UX and information architecture specialist for portfolio storytelling, recruiter scanning, case-study structure, navigation, responsive content hierarchy, and conversion to contact.
model: inherit
---

You design the portfolio experience around how recruiters, founders, product leads, and creative-tech hiring managers actually scan a site.

Primary goals:
- understand Serega's positioning within seconds;
- make breadth feel coherent rather than scattered;
- surface evidence;
- make project status honest;
- turn curiosity into deeper case-study reading;
- make contact effortless.

Always evaluate:
- first 8 seconds;
- 30-second skim;
- 3-minute deep read;
- mobile scan;
- recruiter scan;
- technical hiring manager scan;
- creative director scan.

Reject:
- long autobiography;
- keyword soup;
- duplicate sections;
- buried projects;
- unclear CTA;
- fake metrics;
- overlong navigation;
- desktop-only interactions.

Do not write code unless explicitly asked.
Return structured UX recommendations with priorities.
```

---

## 25.3 `.claude/agents/motion-interaction-director.md`

```md
---
name: motion-interaction-director
description: Premium motion and interaction director. Use for scroll behavior, microinteractions, Motion for React choreography, reduced-motion behavior, and avoiding gimmicky animation.
model: inherit
---

Design motion as communication.

Principles:
- motion reveals hierarchy;
- motion explains relationships;
- motion should not delay content;
- premium means restraint;
- mobile motion is lighter;
- reduced motion is mandatory.

Prefer:
- mask reveals
- subtle shared transitions
- crop transitions
- precise hover feedback
- scroll-linked structural indicators
- 2–6px spatial responses
- carefully designed sticky storytelling

Reject:
- typewriter hero
- bouncing buttons
- mouse-follow glow
- scroll hijacking
- continuous rotation
- excessive stagger
- giant parallax
- animation for every element

For every motion concept provide:
- purpose;
- trigger;
- duration/easing direction;
- mobile behavior;
- reduced-motion fallback;
- performance risk.
```

---

## 25.4 `.claude/agents/portfolio-story-editor.md`

```md
---
name: portfolio-story-editor
description: Senior portfolio editor and case-study writer. Use for concise English/Ukrainian copy, truthful claims, project status language, recruiter-readable storytelling, and removing AI-generated corporate fluff.
model: inherit
---

You edit Serega Tarasyuk's portfolio.

Voice:
- direct
- intelligent
- specific
- confident
- practical
- no corporate fluff
- no fake humility
- no inflated claims

Core positioning:
AI Product Builder / Creative Technologist.

Critical rule:
Never invent:
- metrics
- years
- employers
- launches
- revenue
- user counts
- client outcomes
- testimonials
- awards

Separate:
- shipped
- in testing
- prototype
- concept
- client work
- system design
- experiment

Replace vague claims with:
- decisions
- architecture
- constraints
- workflows
- evidence

Ban phrases:
- passionate developer
- cutting-edge solutions
- innovative ecosystem
- leverage AI
- revolutionize
- seamless experience
- proven track record
unless objectively supported and necessary.

Keep case studies readable.
Write English first, then Ukrainian with natural localization rather than literal translation.
```

---

## 25.5 `.claude/agents/frontend-architecture-lead.md`

```md
---
name: frontend-architecture-lead
description: Senior Next.js and TypeScript architecture lead for a fast content-driven portfolio. Use for component boundaries, Server/Client Component decisions, content model, SEO, image strategy, testing, Docker, and production deployment.
model: inherit
---

Build a production-quality portfolio with:
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS v4
- Motion for React where justified
- content-driven case studies
- minimal client JavaScript
- strong SEO
- image optimization
- Playwright verification
- Docker-ready deployment

Principles:
- Server Components by default
- Client Components only for interaction
- no unnecessary state library
- no CMS in v1
- no database for static portfolio content
- no over-engineering
- no hardcoded repeated project markup
- no secrets in client bundles

Review:
- architecture
- types
- bundle risk
- image sizes
- motion hydration
- metadata
- route structure
- Docker build
- health endpoint
- error handling

Do not sacrifice design quality for abstraction.
```

---

## 25.6 `.claude/agents/qa-accessibility-performance.md`

```md
---
name: qa-accessibility-performance
description: Read-mostly quality specialist for visual regression, responsive layout, keyboard access, accessibility, performance, browser issues, and production readiness.
model: inherit
---

You are the final quality gate.

Audit:
- 320x568
- 360x800
- 390x844
- 430x932
- 768x1024
- 1024x768
- 1280x800
- 1440x900
- 1920x1080

Check:
- horizontal overflow
- clipping
- broken sticky behavior
- unreadable text
- bad line breaks
- hover-only meaning
- focus visibility
- heading hierarchy
- reduced motion
- image layout shift
- broken links
- route errors
- missing metadata
- console errors
- hydration warnings
- keyboard navigation
- tap targets
- motion jank
- contrast
- 404 behavior

Do not accept "tests pass" as visual proof.
Require browser-level verification.
Return issues ordered:
P0 blocker
P1 major
P2 polish
```

---

# 26. CLAUDE CODE SKILLS

Create skills under:

```text
.claude/skills/
```

---

## 26.1 `.claude/skills/design-critique/SKILL.md`

```md
---
name: design-critique
description: Run a strict anti-template visual critique of the current portfolio implementation.
---

Audit the current implementation.

Use the brand-art-director, ux-portfolio-architect, and motion-interaction-director perspectives.

Evaluate:
1. Does this look like a template?
2. Does it look expensive?
3. Is the hierarchy obvious in 8 seconds?
4. Is the yellow signal controlled?
5. Are cards overused?
6. Is typography doing enough work?
7. Is real evidence prioritized?
8. Does mobile feel intentionally designed?
9. Is motion purposeful?
10. What are the three highest-impact improvements?

Do not praise by default.
Be specific.
Then implement the highest-impact fixes unless explicitly asked for critique only.
```

---

## 26.2 `.claude/skills/portfolio-verify/SKILL.md`

```md
---
name: portfolio-verify
description: Run full production verification for responsive behavior, links, routes, visual quality, accessibility, performance risks, and build readiness.
---

Run the portfolio.

Verify the defined viewport matrix.

Check:
- home
- work index
- every project route
- about
- language switch
- mobile menu
- copy email
- keyboard navigation
- reduced motion
- 404
- metadata where inspectable

Use browser-level checks.
Capture screenshots where tooling allows.
Fix P0 and P1 issues.
Re-run checks.
Report remaining P2 polish items honestly.
```

---

## 26.3 `.claude/skills/content-truth-audit/SKILL.md`

```md
---
name: content-truth-audit
description: Audit all portfolio claims against available project evidence and downgrade, remove, or mark uncertain claims.
---

Review all public copy and project data.

Flag:
- invented metrics
- unsupported launch claims
- unsupported client outcomes
- fake years of experience
- inflated titles
- ambiguous project status
- technologies not evidenced
- links not verified

For each issue:
- quote the claim;
- state the risk;
- propose truthful replacement.

Then update the content to the safer version.
```

---

# 27. REQUIRED MULTI-AGENT WORKFLOW

The main Claude session must use the agents in this order.

## Phase A — Discovery

Delegate:

### `ux-portfolio-architect`
Task:
- analyze information architecture;
- recruiter scanning;
- project priority;
- case-study order;
- mobile content hierarchy.

### `portfolio-story-editor`
Task:
- audit positioning;
- rewrite hero;
- create concise project one-liners;
- identify unsupported claims.

### `brand-art-director`
Task:
- turn OBSIDIAN SIGNAL into a complete visual system;
- identify anti-template rules;
- propose homepage composition.

Run these independently where possible.

## Phase B — Synthesis

Main Claude:
- compare outputs;
- resolve contradictions;
- write a short `docs/design-decisions.md`;
- choose one direction;
- do not average everything into a bland compromise.

## Phase C — Architecture

Delegate:
- `frontend-architecture-lead`

Task:
- inspect repo;
- propose route structure;
- content model;
- Server/Client split;
- animation boundaries;
- Docker plan.

## Phase D — Implementation

Main Claude implements in small coherent phases.

## Phase E — Motion Review

Delegate:
- `motion-interaction-director`

Task:
- review actual implementation;
- identify where motion adds meaning;
- remove gimmicks.

## Phase F — Visual Critique

Run `/design-critique`.

## Phase G — Quality Gate

Delegate:
- `qa-accessibility-performance`

Run `/portfolio-verify`.

## Phase H — Truth Gate

Run `/content-truth-audit`.

Only after these gates pass is the site considered production-ready.

---

# 28. IMPLEMENTATION PHASES

## Phase 0 — Audit and setup

- inspect repo;
- inspect assets;
- inventory project files;
- create subagents;
- create skills;
- create `docs/design-decisions.md`;
- create `docs/content-evidence.md`;
- do not start random styling first.

## Phase 1 — Foundation

- initialize or validate Next.js;
- strict TypeScript;
- Tailwind;
- global tokens;
- font setup;
- layout;
- locale structure;
- content model;
- basic metadata;
- base grid.

Definition of done:
- app builds;
- typecheck passes;
- no visual polish debt hidden in broken foundation.

## Phase 2 — Hero and navigation

- desktop hero;
- mobile hero;
- capability signal rail;
- header;
- mobile menu;
- email copy interaction;
- reduced motion.

Then run visual review before building the entire site.

## Phase 3 — Selected work

- project data;
- project cards;
- status model;
- unique card compositions;
- responsive states.

## Phase 4 — Capability system

- “Across Layers” section;
- evidence-based capabilities;
- no percentage bars;
- custom system visualization.

## Phase 5 — Case study system

Build reusable layout, then:
1. Foody
2. AI Video Production System
3. Coffydoor
4. Cruise Brothers
5. 3D Lab
6. other verified work

Do not publish thin case-study pages merely to increase count.

## Phase 6 — About / workflow / contact

- operating system;
- agent-native workflow;
- concise about;
- final contact.

## Phase 7 — Motion pass

- add only justified motion;
- reduced motion;
- mobile simplification.

## Phase 8 — QA

- viewport matrix;
- keyboard;
- routes;
- images;
- links;
- console;
- performance;
- accessibility.

## Phase 9 — Deployment

- Docker;
- Coolify;
- domain;
- health check;
- auto deploy;
- production verification.

---

# 29. DEPLOYMENT — HETZNER + COOLIFY + GITHUB

Known target:
- Hetzner server exists;
- domain exists;
- Coolify exists;
- changes are pushed through Git.

Recommended workflow:

```text
LOCAL PROJECT
    ↓
GIT COMMIT
    ↓
GITHUB PUSH
    ↓
COOLIFY AUTO DEPLOY
    ↓
BUILD
    ↓
HETZNER
    ↓
DOMAIN
```

## 29.1 Next.js production settings

Prefer standalone output if compatible:

```ts
// next.config.ts
const nextConfig = {
  output: "standalone",
};

export default nextConfig;
```

Adapt to actual Next.js configuration.

## 29.2 Docker

Create a production multi-stage Dockerfile.

Requirements:
- deterministic install from lockfile;
- builder stage;
- standalone runtime;
- non-root user where practical;
- production env;
- expose app port;
- no dev dependencies in runtime;
- `.dockerignore`.

Do not hardcode secrets into image layers.

## 29.3 Health endpoint

Create:

```text
GET /api/health
```

Return minimal JSON:

```json
{
  "status": "ok"
}
```

Do not expose server internals.

## 29.4 Coolify

Configure:
- GitHub repository;
- production branch, normally `main`;
- auto deploy on push;
- domain;
- HTTPS;
- health check if appropriate.

Use GitHub App integration or a secure webhook approach already supported by the user’s Coolify setup.

Do not put webhook secrets into Git.

## 29.5 Environment

Create `.env.example`.

The portfolio should ideally need almost no runtime secrets in v1.

If future integrations are added:
- server-only variables stay server-only;
- never use `NEXT_PUBLIC_` for secrets.

---

# 30. GIT WORKFLOW

Use small meaningful commits.

Suggested pattern:

```text
chore: initialize portfolio foundation
feat: add obsidian signal design tokens
feat: build responsive hero identity
feat: add selected work content model
feat: add foody case study
feat: add ai video pipeline visualization
feat: add bilingual content
test: add responsive portfolio checks
fix: resolve mobile overflow and focus states
chore: add production docker deployment
```

Before push:
- lint;
- typecheck;
- build;
- relevant tests.

Do not create one giant “finished website” commit.

---

# 31. VISUAL QA PROCESS

After meaningful UI phases:

1. run site;
2. inspect desktop;
3. inspect mobile;
4. capture screenshots if tooling permits;
5. compare against this spec;
6. run art-director critique;
7. fix.

### Required visual questions

- Does the hero feel unique?
- Can I explain Serega in one sentence after 8 seconds?
- Is the yellow acting as a signal?
- Does the site look expensive without pretending?
- Are project images doing real work?
- Are case studies evidence-rich?
- Is there too much card UI?
- Are there template-like sections?
- Is the mobile version a real design?
- Does every animation have a reason?

---

# 32. TESTING

Use Playwright.

Minimum tests:

## Navigation
- home opens;
- work opens;
- project routes open;
- unknown project returns expected behavior;
- locale switching works.

## Responsive
- no horizontal overflow;
- hero CTA visible;
- selected work readable;
- nav usable.

## Interaction
- copy email;
- menu;
- project links;
- language switch.

## Accessibility
- basic automated scan if integrated;
- keyboard tab path;
- focus states;
- reduced motion behavior where testable.

## Visual regression

For key viewports, use screenshot comparison after design stabilizes.

Do not create snapshots too early while layout is still changing rapidly.

---

# 33. CONTENT ASSET INVENTORY

Create:

```text
docs/content-evidence.md
```

For every public project:

```md
## Foody

Status:
Evidence:
- file:
- screenshot:
- repo:
- deployed URL:

Claims allowed:
- ...

Claims not verified:
- ...

Assets approved for portfolio:
- ...
```

This protects against accidental invention.

---

# 34. WHAT “EXPENSIVE” MEANS IN THIS PROJECT

Expensive does **not** mean:
- more gradients;
- more animation;
- more blur;
- more 3D;
- more text.

Expensive means:
- confident spacing;
- typography;
- image selection;
- custom composition;
- restraint;
- detail;
- motion timing;
- coherent system;
- no accidental UI;
- no broken mobile layout;
- clear authorship.

---

# 35. ANTI-TEMPLATE CHECKLIST

Before finalizing any section, reject it if it has 3 or more of these:

- centered badge above centered headline;
- centered paragraph;
- two centered CTA buttons;
- three equal feature cards;
- gradient blob behind everything;
- generic bento grid;
- floating tech logos;
- huge rounded rectangle;
- meaningless stats;
- “trusted by” row;
- fake testimonials;
- skill percentages;
- animated typewriter;
- default shadcn look;
- default Tailwind spacing everywhere;
- same border radius everywhere;
- same card component repeated 12 times.

One or two common patterns can exist.
The overall composition must not feel generated from a landing-page prompt.

---

# 36. INITIAL HOMEPAGE COPY — ENGLISH

Use as a starting point, then let the story editor refine.

## Hero

Eyebrow:

```text
PORTFOLIO / 2026
```

Headline:

```text
I build at the point where product, AI, code, and visual storytelling meet.
```

Role:

```text
AI Product Builder & Creative Technologist
```

Body:

```text
I turn rough ideas into working mobile products, AI workflows, generative media systems, automation, 3D experiments, and deployable software.
```

CTA:

```text
Selected work
```

Secondary:

```text
Copy email
```

## Selected work intro

```text
Selected work
Different mediums. Same instinct: find the hard part, build the system, iterate until it works.
```

## Across Layers

```text
Across layers
My advantage is not one tool. It is the ability to connect product logic, UX, AI, code, media, infrastructure, and physical making into one execution loop.
```

## Workflow

```text
My operating system
Fast does not have to mean careless. I use AI agents aggressively, but I keep the work grounded in project context, real constraints, review, and deployment.
```

## About

```text
I am a multidisciplinary builder from Ukraine working across AI products, mobile apps, generative media, automation, and 3D.

I learn by building. A product problem may take me from UX logic to Supabase, from a camera workflow to an AI proxy, from a storyboard to a generative video pipeline, or from Blender to a physical print.

The common thread is simple: I like turning vague ideas into systems that work.
```

## Contact

```text
Have a hard idea? Good.

I am most useful where product, AI, creative technology, and fast execution overlap.
```

---

# 37. INITIAL HOMEPAGE COPY — UKRAINIAN

Natural localization, not literal translation.

## Hero

Eyebrow:

```text
ПОРТФОЛІО / 2026
```

Headline:

```text
Я працюю на перетині продукту, ШІ, коду та візуального сторітелінгу.
```

Role:

```text
AI Product Builder & Creative Technologist
```

Body:

```text
Перетворюю сирі ідеї на мобільні продукти, AI-воркфлоу, генеративні медіасистеми, автоматизації, 3D-експерименти та софт, який можна реально задеплоїти.
```

CTA:

```text
Обрані роботи
```

Secondary:

```text
Скопіювати email
```

## Selected work intro

```text
Обрані роботи
Різні формати. Один підхід: знайти найскладнішу частину, побудувати систему й довести її ітераціями до робочого стану.
```

## Across Layers

```text
Між рівнями
Моя перевага — не один інструмент. Я вмію з'єднувати продуктову логіку, UX, ШІ, код, медіа, інфраструктуру та фізичне прототипування в один цикл виконання.
```

## Workflow

```text
Моя операційна система
Швидко — не означає недбало. Я активно використовую AI-агентів, але тримаю роботу прив'язаною до контексту проєкту, реальних обмежень, перевірки та деплою.
```

## About

```text
Я мультидисциплінарний білдер з України. Працюю з AI-продуктами, мобільними застосунками, генеративним медіа, автоматизацією та 3D.

Я вчуся через створення. Одна продуктова задача може провести мене від UX-логіки до Supabase, від камери до серверного AI-проксі, від сторіборду до генеративного відеопайплайну або від Blender до фізичного друку.

Спільна риса проста: мені подобається перетворювати нечіткі ідеї на системи, які працюють.
```

## Contact

```text
Є складна ідея? Чудово.

Я найкорисніший там, де перетинаються продукт, ШІ, creative technology та швидке виконання.
```

---

# 38. DEFINITION OF DONE

The project is complete only when all are true.

## Product

- positioning is clear in 8 seconds;
- selected work is prioritized;
- project statuses are truthful;
- contact is effortless.

## Design

- does not look like a template;
- OBSIDIAN SIGNAL system is coherent;
- typography is strong;
- yellow is controlled;
- mobile is intentionally designed;
- project imagery is meaningful.

## Engineering

- production build passes;
- strict TypeScript passes;
- no major console errors;
- no broken routes;
- optimized images;
- minimal unnecessary client JS;
- Docker build works;
- health endpoint works.

## Accessibility

- keyboard usable;
- focus visible;
- heading structure logical;
- reduced motion works;
- contrast acceptable;
- tap targets usable.

## Responsive

- all required viewports checked;
- no horizontal overflow;
- no clipping;
- no broken sticky sections.

## Truth

- no fake metrics;
- no fake testimonials;
- no unsupported launch claims;
- no invented employers;
- no dead social links.

## Deployment

- GitHub push workflow documented;
- Coolify deployment configured;
- domain configured;
- HTTPS verified;
- production smoke check completed.

---

# 39. FINAL INSTRUCTION TO CLAUDE

Do not start by generating a generic homepage.

Start by creating the agents and skills from this file.

Then:

1. audit the repository and assets;
2. run the discovery agents;
3. write `docs/design-decisions.md`;
4. write `docs/content-evidence.md`;
5. establish the design tokens and grid;
6. build the hero;
7. visually verify the hero on mobile and desktop;
8. only then continue into the full site.

The standard is not:

> “Looks good for an AI-generated website.”

The standard is:

> **“Looks like a strong independent creative technology studio designed and engineered it on purpose.”**

And the portfolio must make one thing unmistakable:

> **Serega Tarasyuk can take an unclear idea, cross disciplines, build the system, and push it toward reality.**
