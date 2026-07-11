import type { en } from "./copy.en";

export const uk: typeof en = {
  nav: {
    work: "Роботи",
    about: "Про мене",
    contact: "Зв'язатись",
  },
  hero: {
    eyebrow: "ПОРТФОЛІО / 2026",
    headline: "Я працюю на перетині продукту, ШІ, коду та візуального сторітелінгу.",
    role: "AI Product Builder & Creative Technologist",
    body: "Перетворюю сирі ідеї на мобільні продукти, AI-системи, генеративне відео та речі, які залишають екран і стають фізичними об'єктами.",
    ctaPrimary: "Обрані роботи",
    ctaSecondary: "Скопіювати email",
    emailCopied: "Скопійовано",
  },
  toolsMarquee: {
    eyebrow: "Інструменти, з якими працюю",
  },
  orbit: {
    worlds: {
      "3d": "3D",
      video: "Video Creator",
      developers: "Developer",
    },
    worldTagline: {
      "3d": "Blender, Cinema 4D, 3ds Max і друки, що залишають екран.",
      video: "Сторіборди, генеративні пайплайни та доставка в Remotion.",
      developers: "Застосунки, сайти та AI-автоматизація — від no-code до full-code.",
    },
    back: "Назад",
    prevLabel: "Попередній світ",
    nextLabel: "Наступний світ",
    viewProject: "Відкрити кейс",
    comingSoon: "Тут скоро з'явиться більше робіт",
    switchWorld: "Перемкнути світ",
    blockLabel: "Блок",
  },
  extraWork: {
    games: {
      label: "Game Dev",
      tagline: "Інтерактивні білди та ігрові експерименти — з'являться тут у міру релізів.",
    },
    aiCreator: {
      label: "AI Creator",
      tagline: "Ролики, зроблені повністю за допомогою генеративного ШІ — без камери й знімальної групи.",
    },
  },
  figurines: {
    sectionTitle: "Друки",
    filament: "Філамент",
    printTime: "Час друку",
    material: "Матеріал",
    printer: "Принтер",
  },
  bioCard: {
    age: "31",
    experiences: [
      {
        title: "Проджект-менеджер",
        description: "Перетворюю розмиті ідеї на чіткі плани — один зрозумілий результат, шлях до релізу й чесний скоуп.",
      },
      {
        title: "Middle AI Developer",
        description: "Будую мобільні й веб-продукти на основі AI — інтеграції Gemini/Claude, prompt-системи, серверні проксі.",
      },
      {
        title: "Video Creator",
        description: "Структуровані AI-пайплайни відео — від брифу до сторіборду й рендеру в Remotion, з реальною доставкою.",
      },
      {
        title: "3D-моделювання + друк",
        description: "Від Blender і Cinema 4D до нарізаного, надрукованого об'єкта — ідеї, що залишають екран.",
      },
    ],
  },
  connect: {
    cta: "Зв'язатись",
    telegram: "Telegram",
    email: "Email",
    twitter: "Twitter",
  },
  gridScroll: {
    toggle: "Рух сітки",
    speed: "Швидкість",
  },
  theme: {
    switchToLight: "Перемкнути на світлу тему",
    switchToDark: "Перемкнути на темну тему",
  },
  developersFilter: {
    all: "Усі",
    apps: "Застосунки",
    websites: "Сайти",
    games: "Ігри",
  },
  videoWorld: {
    videosComingSoon: "Відео за категоріями з'являться тут незабаром.",
    uncategorized: "Інше",
    categories: {
      events: "Івенти",
      interview: "Інтерв'ю",
      promo: "Промо",
      realisticCinematic: "Реалістичне кіно",
      viralVideo: "Вірусні відео",
    },
    viewAll: "Усі кліпи →",
    allClips: "Повна добірка цієї категорії.",
  },
  videoPlayer: {
    play: "Відтворити",
    pause: "Пауза",
    mute: "Вимкнути звук",
    unmute: "Увімкнути звук",
    volume: "Гучність",
    fullscreen: "Повний екран",
    close: "Закрити",
  },
  rail: {
    label: "Між рівнями",
    nodes: [
      { id: "product", label: "ПРОДУКТ", proof: "UX-логіка, онбординг, готовність до релізу" },
      { id: "mobile", label: "МОБАЙЛ", proof: "Expo / React Native / Supabase" },
      { id: "ai", label: "ШІ", proof: "Gemini / Claude, fallback-логіка, серверний проксі" },
      { id: "video", label: "ВІДЕО", proof: "Сторіборди, Remotion, генеративні пайплайни" },
      { id: "3d", label: "3D", proof: "Blender, слайсинг, FDM-друк" },
      { id: "automation", label: "АВТОМАТИЗАЦІЯ", proof: "Webhooks, Telegram-боти, Edge Functions" },
      { id: "deploy", label: "ДЕПЛОЙ", proof: "GitHub / Coolify / Hetzner / Cloudflare" },
    ],
  },
  selectedWork: {
    title: "Мої роботи",
    intro: "Різні формати. Один підхід: знайти найскладнішу частину, побудувати систему й довести її ітераціями до робочого стану.",
    openCaseStudy: "Відкрити кейс",
    view: "Дивитись",
    roleLabel: "Роль",
    stackLabel: "Стек",
  },
  caseStudy: {
    hardPart: "Найскладніша частина",
    summary: "Огляд",
    approach: "Підхід",
    demo: "Демо",
    verificationNote: "Примітка щодо перевірки",
  },
  capabilities: {
    eyebrow: "МОЖЛИВОСТІ",
    title: "Докази, а не відсотки",
    groups: [
      {
        label: "Продуктові системи, а не окремі екрани",
        items: ["Архітектура фіч", "Онбординг", "Межі монетизації", "Готовність до релізу", "Ітеративний фідбек"],
      },
      {
        label: "Мобільні продукти від взаємодії до бекенду",
        items: ["Expo / React Native", "TypeScript", "Навігація", "OTA-оновлення", "Supabase", "Віджети"],
      },
      {
        label: "ШІ як продуктова інфраструктура",
        items: ["Claude", "Gemini", "Структуровані відповіді", "Fallback-логіка", "Серверний проксі", "Vision & voice"],
      },
      {
        label: "Генеративні медіа з продакшн-дисципліною",
        items: ["Veo / Kling", "Сторіборди", "Безперервність", "Побудова кадру", "Remotion", "AI-музика"],
      },
      {
        label: "Малі системи, що знімають ручну роботу",
        items: ["Supabase Edge Functions", "Cloudflare Workers", "Webhooks", "Telegram-боти"],
      },
      {
        label: "Мене турбує шлях до продакшну",
        items: ["GitHub", "Coolify", "Hetzner", "Cloudflare", "Push-to-deploy"],
      },
      {
        label: "Від пікселів до фізичних об'єктів",
        items: ["Blender", "Cinema 4D", "3ds Max", "FDM-друк", "Bambu Studio", "Фізичні ітерації"],
      },
    ],
  },
  workflow: {
    eyebrow: "МОЯ ОПЕРАЦІЙНА СИСТЕМА",
    title: "Моя операційна система",
    intro: "Швидко — не означає недбало. Я активно використовую AI-агентів, але не сліпо: тримаю роботу прив'язаною до контексту проєкту, реальних обмежень, перевірки та деплою.",
    stages: [
      { index: "01", title: "Знайти справжню проблему", body: "Зводжу розмиту ідею до однієї корисної дії користувача й одного чіткого результату." },
      { index: "02", title: "Будувати систему, а не лише екран", body: "Продумую дані, стани, крайні випадки, поведінку ШІ, межі бекенду та шлях до деплою." },
      { index: "03", title: "Активно, але не сліпо використовувати агентів", body: "Claude Code, Codex та спеціалізовані AI-воркфлоу пришвидшують виконання. Пам'ять проєкту, обмеження, рев'ю та перевірка тримають роботу цілісною." },
      { index: "04", title: "Ітерувати в реальних умовах", body: "Реальні пристрої, реальні ліміти API, дивні крайні випадки, вимоги сторів, невдалі генерації та провальні друки — частина процесу." },
      { index: "05", title: "Випускати, спостерігати, покращувати", body: "Пуш, деплой, тест, збір фідбеку, виправлення важливого, повторення." },
    ],
  },
  agentNative: {
    eyebrow: "AGENT-NATIVE, PRODUCT-LED",
    title: "Agent-native, product-led",
    body: "Я використовую AI-агентів як середовище розробки, а не як генератор коду в один прохід. Тримаю пам'ять проєкту, розбиваю роботу на етапи, перевіряю поведінку й проводжу зміни через реальний Git та деплой.",
    loop: ["НАМІР", "ПАМ'ЯТЬ ПРОЄКТУ", "АГЕНТ", "РЕАЛІЗАЦІЯ", "РЕВ'Ю", "РЕАЛЬНИЙ ПРИСТРІЙ / БРАУЗЕР", "GIT", "ДЕПЛОЙ", "ФІДБЕК"],
  },
  about: {
    eyebrow: "ПРО МЕНЕ",
    title: "Про мене",
    body: [
      "Я Сергій — білдер з Києва. Працюю на стику AI-продуктів, мобільних застосунків, відео, автоматизації та 3D, залежно від того, куди веде задача.",
      "Здебільшого я вчився, просто роблячи речі: продумуючи UX, налаштовуючи Supabase, перетворюючи камеру на AI-воркфлоу або доводячи модель від Blender до фізичного друку.",
      "А поєднує все це доволі просто — мені подобається брати хаотичну ідею і перетворювати її на щось, що реально працює.",
    ],
  },
  contact: {
    eyebrow: "КОНТАКТИ",
    title: "Складна ідея? Добре.",
    body: "Тут я роблю свою найкращу роботу: продукт, ШІ, creative technology, швидке виконання.",
    ctaPrimary: "Написати email",
    ctaSecondary: "Скопіювати email",
    availability: "Відкритий до сильних продуктових, AI та creative-tech можливостей",
  },
  footer: {
    rights: "Усі права захищено.",
  },
  status: {
    shipped: "ЗАПУЩЕНО",
    "in-testing": "НА ТЕСТУВАННІ",
    prototype: "ПРОТОТИП",
    concept: "КОНЦЕПТ",
    "client-work": "КЛІЄНТСЬКА РОБОТА",
    "system-design": "ДИЗАЙН СИСТЕМИ",
    experiment: "ЕКСПЕРИМЕНТ",
  },
  notFound: {
    title: "Сторінку не знайдено",
    body: "Такої сторінки не існує — або ідея за нею так і не була реалізована.",
    cta: "На головну",
  },
};
