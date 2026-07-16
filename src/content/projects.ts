import type { PortfolioProject } from "./types";

export const projects: PortfolioProject[] = [
  {
    slug: "foody",
    title: "Foody — AI Food & Home Inventory Product",
    shortTitle: "Foody",
    year: "2026",
    status: "in-testing",
    tier: "flagship",
    world: "developers",
    developerCategory: "app",
    role: ["Product Strategy", "UX Logic", "AI Integration", "Mobile Development", "Supabase Architecture", "Prompt / Output Design"],
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "Gemini", "Claude"],
    capabilities: ["mobile", "ai", "automation"],
    oneLine: {
      en: "Mobile food-inventory app with photo, receipt, and voice input, Gemini/Claude fallback — in Android testing.",
      uk: "Мобільний застосунок для обліку продуктів: фото, чек, голос, fallback Gemini/Claude — на тестуванні в Android.",
    },
    summary: {
      en: "A mobile product built around food inventory, AI-assisted analysis, recipes, shopping, and personal utility workflows: a full product system running from camera input through a server-side AI proxy to a personalized experience.",
      uk: "Мобільний продукт для обліку продуктів удома: AI-аналіз, рецепти, список покупок. Повна продуктова система від камери до серверного AI-проксі й персоналізованого досвіду.",
    },
    challenge: {
      en: "Food and home inventory data is messy: users don't want to type everything, images are imperfect, receipts are inconsistent, AI can be wrong, and mobile UX must stay fast and understandable.",
      uk: "Дані про продукти вдома — хаотичні: користувачі не хочуть все вводити вручну, фото недосконалі, чеки непослідовні, ШІ може помилятись, а мобільний UX має лишатись швидким і зрозумілим.",
    },
    approach: {
      en: [
        "Camera-first workflows for fridge and receipt capture",
        "Structured AI actions behind a server-side proxy — no keys on the client",
        "Model routing with automatic fallback (Gemini primary, Claude reserve)",
        "Meaningful empty, loading, and error states",
        "Multilingual product surface across 9 locales",
        "Release-readiness work for Android Closed Testing",
      ],
      uk: [
        "Camera-first сценарії для холодильника та чеків",
        "Структуровані AI-дії за серверним проксі — без ключів на клієнті",
        "Роутинг моделей з автоматичним fallback (Gemini основний, Claude резервний)",
        "Змістовні порожні, завантажувальні та помилкові стани",
        "Багатомовний інтерфейс на 9 мовах",
        "Підготовка до релізу для Android Closed Testing",
      ],
    },
    media: [{ kind: "diagram", label: "Input → AI proxy → model routing → Supabase → product UI" }],
    verificationNote: {
      en: "Currently in Android Closed Testing. No public store launch, user count, or revenue claimed.",
      uk: "Наразі в Android Closed Testing. Без заяв про публічний запуск, кількість користувачів чи дохід.",
    },
  },
  {
    slug: "foody-web",
    title: "appfoody.com — Foody Marketing Website",
    shortTitle: "Foody Web",
    year: "2026",
    status: "shipped",
    tier: "compact",
    world: "developers",
    developerCategory: "website",
    role: ["Web Development", "Copywriting", "Deployment"],
    stack: ["TypeScript", "GitHub", "Cloudflare"],
    capabilities: ["deploy"],
    links: [{ label: "appfoody.com", href: "https://appfoody.com/" }],
    oneLine: {
      en: "Marketing website for the Foody app, live at appfoody.com.",
      uk: "Маркетинговий сайт застосунку Foody, живий на appfoody.com.",
    },
    summary: {
      en: "The public-facing website for Foody — a separate TypeScript codebase from the mobile app, deployed via GitHub and Cloudflare, presenting the product to visitors ahead of its own store listing.",
      uk: "Публічний сайт для Foody — окрема TypeScript-кодова база від мобільного застосунку, задеплоєна через GitHub і Cloudflare, що презентує продукт відвідувачам ще до появи в сторах.",
    },
  },
  {
    slug: "frameforg",
    title: "FrameForg — AI Video Production System",
    shortTitle: "FrameForg",
    year: "2026",
    status: "shipped",
    tier: "flagship",
    world: "developers",
    developerCategory: "website",
    role: ["Product Architecture", "Agent Workflow Design", "Creative Direction", "Prompt Systems", "Remotion", "Pipeline Design"],
    stack: ["Next.js", "Supabase", "Docker", "Remotion", "FFmpeg"],
    capabilities: ["ai", "video", "automation", "deploy"],
    links: [{ label: "frameforg.online", href: "https://frameforg.online" }],
    oneLine: {
      en: "Live AI video-production platform — brief to storyboard to Remotion render, delivered in about an hour.",
      uk: "Жива платформа AI-продакшну відео — від брифу до сторіборду й рендеру в Remotion, доставка приблизно за годину.",
    },
    summary: {
      en: "A live product for AI-assisted promo video production: a structured creative brief, an AI creative-director agent generating the storyboard, a multi-engine generation stage, Remotion motion graphics, a QA pass, and delivery in vertical, widescreen, and square formats, with revision requests supported.",
      uk: "Жива продукт для AI-продакшну промо-відео: структурований бриф, AI creative-director агент генерує сторіборд, багатодвигунова генерація, моушн-графіка на Remotion, QA-прохід і доставка у вертикальному, горизонтальному та квадратному форматах, з підтримкою правок.",
    },
    approach: {
      en: [
        "Structured brief → AI creative-director agent → storyboard → shot system",
        "Multi-engine generation stage feeding a Remotion render pipeline",
        "Background worker architecture for long-running render jobs",
        "Supabase-backed order and asset storage",
        "QA pass before delivery, with revision requests supported",
      ],
      uk: [
        "Бриф → AI creative-director агент → сторіборд → система кадрів",
        "Багатодвигунова генерація, що живить рендер-пайплайн у Remotion",
        "Фонові воркери для довгих рендер-задач",
        "Зберігання замовлень і асетів у Supabase",
        "QA-прохід перед доставкою, з підтримкою правок",
      ],
    },
    media: [{ kind: "diagram", label: "Brief → storyboard → generation → Remotion → audio → QA → delivery" }],
    verificationNote: {
      en: "Live and public at frameforg.online as of July 2026 — real paid tiers, a working checkout, and a delivery pipeline in production. Specific user counts or revenue are not claimed.",
      uk: "Живий і публічний на frameforg.online станом на липень 2026 — реальні платні тарифи, робочий чекаут і пайплайн доставки в production. Конкретна кількість користувачів чи дохід не заявляються.",
    },
  },
  {
    slug: "3d-lab",
    title: "3D Design & Fabrication Lab",
    shortTitle: "3D Lab",
    year: "2026",
    status: "experiment",
    tier: "compact",
    world: "3d",
    role: ["3D Modeling", "FDM Printing", "Rapid Prototyping", "Physical Iteration"],
    stack: ["Blender", "Cinema 4D", "3ds Max", "Bambu Studio"],
    capabilities: ["3d"],
    oneLine: {
      en: "Idea to 3D model to sliced, printed object — iteration you can hold.",
      uk: "Від ідеї через 3D-модель до нарізаного, надрукованого об'єкта — ітерація, яку можна потримати.",
    },
    summary: {
      en: "I like products that leave the screen. Modeling across Blender, Cinema 4D, and 3ds Max, preparing geometry for print, slicing in Bambu Studio, and iterating through failed prints toward a physical result: 3D printing that spans practically anything, rather than sticking to one fixed product line.",
      uk: "Мені подобаються продукти, що залишають екран. Моделювання в Blender, Cinema 4D та 3ds Max, підготовка геометрії до друку, слайсинг у Bambu Studio та ітерації крізь невдалі друки до фізичного результату: 3D-друк, що охоплює практично будь-що, а не тримається однієї лінійки продуктів.",
    },
    media: [{ kind: "diagram", label: "Idea → model → geometry check → slice → print → adjust" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
