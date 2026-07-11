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
      en: "A mobile product built around food inventory, AI-assisted analysis, recipes, shopping, and personal utility workflows — not a chat wrapper, a full product system from camera input to a server-side AI proxy to a personalized experience.",
      uk: "Мобільний продукт для обліку продуктів удома: AI-аналіз, рецепти, список покупок. Не «обгортка над чатом» — повна продуктова система від камери до серверного AI-проксі й персоналізованого досвіду.",
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
    slug: "ai-video-production",
    title: "AI Video Production System",
    shortTitle: "AI Video System",
    year: "2026",
    status: "system-design",
    tier: "flagship",
    world: "developers",
    developerCategory: "app",
    role: ["Product Architecture", "Agent Workflow Design", "Creative Direction", "Prompt Systems", "Remotion", "Pipeline Design"],
    stack: ["Next.js", "Supabase", "Docker", "Remotion", "FFmpeg"],
    capabilities: ["ai", "video", "automation", "deploy"],
    oneLine: {
      en: "A designed pipeline from brief to storyboard to Remotion render — built, not yet public.",
      uk: "Побудований пайплайн від брифу до сторіборду й рендеру в Remotion — готовий, ще не публічний.",
    },
    summary: {
      en: "A system for AI-assisted promo/video production: structured creative brief, order storage, storyboard and shot planning stages, generation pipeline, Remotion motion graphics, background worker architecture, QA, and delivery.",
      uk: "Система для AI-продакшну промо-відео: структурований бриф, збереження замовлень, сторіборд і планування кадрів, генеративний пайплайн, моушн-графіка на Remotion, воркери у фоні, QA та доставка.",
    },
    approach: {
      en: [
        "Structured brief → analysis → concept → storyboard → shot system",
        "Image/video generation stage feeding a Remotion render pipeline",
        "Background worker architecture for long-running render jobs",
        "Supabase-backed order and asset storage",
        "QA pass before delivery",
      ],
      uk: [
        "Бриф → аналіз → концепт → сторіборд → система кадрів",
        "Генерація зображень/відео, що живить рендер-пайплайн у Remotion",
        "Фонові воркери для довгих рендер-задач",
        "Зберігання замовлень і асетів у Supabase",
        "QA-прохід перед доставкою",
      ],
    },
    media: [{ kind: "diagram", label: "Brief → storyboard → generation → Remotion → audio → QA → delivery" }],
    verificationNote: {
      en: "The pipeline and infrastructure are built and deployed (Docker, worker process, Coolify/Hetzner). The full autonomous platform is not claimed as production-live for external customers.",
      uk: "Пайплайн та інфраструктура побудовані й задеплоєні (Docker, воркер, Coolify/Hetzner). Повна автономна платформа не заявляється як production-live для зовнішніх клієнтів.",
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
      en: "I like products that leave the screen. Modeling across Blender, Cinema 4D, and 3ds Max, preparing geometry for print, slicing in Bambu Studio, and iterating through failed prints toward a physical result — 3D printing of practically anything, not one fixed product line.",
      uk: "Мені подобаються продукти, що залишають екран. Моделювання в Blender, Cinema 4D та 3ds Max, підготовка геометрії до друку, слайсинг у Bambu Studio та ітерації крізь невдалі друки до фізичного результату — 3D-друк практично будь-чого, без прив'язки до однієї лінійки продуктів.",
    },
    media: [{ kind: "diagram", label: "Idea → model → geometry check → slice → print → adjust" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
