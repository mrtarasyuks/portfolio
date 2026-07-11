@AGENTS.md

# Portfolio — Claude Code Context

## Що це за проєкт
Premium портфоліо-сайт для Serhii Tarasiuk (AI Product Builder & Creative Technologist, Kyiv). Окремий репозиторій від `Foody` (`c:/Users/WellDone/projects/portfolio`). Editorial-дизайн з 3D hero-сценою (React Three Fiber), три "світи" (3D / Video / Developers), білінгвальний (en/uk), світла/темна тема.

Побудований за `docs/brief.md` (первинний майстер-спек) — але **актуальний стан дизайну документований у `docs/design-decisions.md`**, не в brief.md. Brief.md — історичний вхідний документ, design-decisions.md — живий журнал усіх наступних правок (9+ "pivot"-записів), включно з тим, де рішення явно замінюють/скасовують пункти з brief.md чи попередніх pivot-ів.

## Технологічний стек
- **Framework**: Next.js 16.2.10 (App Router, Turbopack, `proxy.ts` замість `middleware.ts`)
- **Language**: TypeScript strict
- **3D**: React Three Fiber (`@react-three/fiber`) + `@react-three/drei` — hero canvas (`HeroOrbitScene`, avatar, per-world backdrops, grid-scroll motion)
- **Styling**: Tailwind CSS v4
- **Theming**: власний light/dark toggle (`ThemeContext`, cookie-persisted, server-read у root layout щоб уникнути flash) — **scoped навмисно**: тільки chrome/контентні сторінки (header, footer, About/Work/Contact, картки, кейс-стаді). 3D hero canvas і per-world палітра (`worldTheme.ts`) НЕ реагують на toggle — це свідома атмосферна темна вітрина незалежно від теми
- **Animation**: `motion` (Framer Motion для React 19), плюс CSS transform/keyframe трюки (bio card thickness, drift, stagger fade, typewriter)
- **i18n**: власна легка система (не next-intl) — `[locale]` route segment (`en`/`uk`), `src/content/copy.en.ts`/`copy.uk.ts`, типобезпечно звірені одне з одним через `src/content/copy.ts` (`CopyDict = typeof en`)
- **Тести**: Playwright (`tests/*.spec.ts`) — navigation, accessibility, responsive (no-console-errors, no horizontal overflow), projects/world-carousel
- **Контент**: без CMS/БД — усе в `src/content/*.ts` (profile, projects, worldTheme, copy, tools)
- **Медіа**: self-hosted відео на Hetzner через Coolify+Caddy (`NEXT_PUBLIC_MEDIA_BASE_URL`), деталі — [docs/media-hosting.md](docs/media-hosting.md)

## Структура проєкту
```
src/
  app/[locale]/        # en/uk маршрути; / редіректить через src/proxy.ts
    layout.tsx           # root layout: читає theme-cookie server-side, монтує ThemeProvider/WorldNavProvider/GridScrollProvider + AmbientBackground (глобально, один раз)
    page.tsx             # головна — 3D hero (HeroOrbitScene) + секції нижче
    about/                # About: AnimatedName (один рядок), AboutVideoPanel (справжній 9:16 box), typewriter-опис
    work/                 # /work — WorldChooserBlocks (3 glass-блоки, fly-to-center transition) + SelectedWorkList
      [slug]/               # кейс-стаді конкретного проєкту
      3d/ video/ developers/  # world gallery pages — ЗАРЕЗЕРВОВАНІ слаги, ніколи не використовувати як project.slug
    contact/              # окрема сторінка існує, header Connect веде до dropdown, не сюди напряму
  components/
    hero/                 # HeroOrbitScene (canvas), GridScrollControl, ConnectBurstButton, ProjectSliderPanel (drum-карусель), DrumProjectCard
    scene/                 # 3D-примітиви: Avatar, BioCard (~3x, справжній 9:16-фото box), CameraRig, WorldBackdrop
      backdrops/              # per-world "сигнатурний рух", вмикається grid-scroll кнопкою:
                               #   ServerColumnField (Developers) — вертикальні лінії-лампи, fade-колір
                               #   PrintRingField (3D) — RingVase (3 штуки: одна що "друкується" + 2 нових справа), еквалайзер-пульс
                               #   FrameCardField (Video) — FallingDonuts (обертання + нескінченне падіння)
                               #   FloorGrid — спільна сітка-підлога всіх трьох світів, скролиться при увімкненому контролі
                               #   FloatingDebris — генерик debris (box/octahedron), torus замінено на FallingDonuts у Video
    layout/                # SiteHeader (Server Component) + client-острівці: WorldSwitchHeaderNav, HeroGridScrollBar, HeaderConnectButton, ThemeToggle, LanguageSwitch (справжні SVG-прапори через FlagIcon, НЕ emoji), MobileMenu, HeaderHeightVar
    work/                  # WorldChooserBlocks, WorldGallery, GlassProjectBlock, DevelopersFilter (Apps/Websites/Games таби), ToolsUsed, VideosByCategory, ProjectCardFlagship/Compact
    about/                  # AnimatedName, AboutVideoPanel
    graphics/               # кастомні SVG/CSS-діаграми для кейс-стаді (кожна — своя "shape grammar", не переюзана)
    ui/                     # GlassPanel (спільний glass-рецепт, theme-aware через --glass-* CSS vars), StaggerFadeIn, TypewriterText, CopyEmailButton, AmbientBackground (глобальний, монтується раз у layout), PageTitleWatermark (велика фонова назва сторінки)
  content/                # profile.ts, projects.ts (PortfolioProject[], developerCategory?), worldTheme.ts, copy.en/uk.ts, copy.ts (CopyDict), assetPaths.ts, tools.ts (videoTools, порожній — контент прийде пізніше), types.ts (ThemeMode тут теж)
  context/                # WorldNavContext (активний світ), GridScrollContext (раніше SpotlightContext — той самий toggle+slider UI, тепер керує per-world рухом замість прожектора), ThemeContext (light/dark, cookie-synced)
  lib/                    # cn.ts, seo.ts, media.ts, publicAsset.ts (server-side fs.existsSync для опційних асетів), locale-cookie.ts, theme-cookie.ts
  hooks/                  # useLerpedColor, useMinWidth, useWebglSupport (містить useReducedMotion)
docs/
  brief.md                # історичний master-спек (вхідний бриф, НЕ поточний стан)
  design-decisions.md      # ЖИВИЙ журнал усіх дизайн-рішень і "pivot"-раундів — читати ПЕРШИМ для "чому так зроблено"
  content-evidence.md      # що repo-verified vs user-asserted vs потребує реальних асетів (screenshots/відео)
  media-hosting.md         # self-hosted відео на Hetzner/Coolify/Caddy
```

**Видалені за непотрібністю** (нуль референсів на момент видалення — не шукати їх, вони не існують): `AbstractFigure.tsx` (wireframe-заглушка на час завантаження аватара — прибрана, `Suspense fallback={null}`), `OrbitProjectCard.tsx`/`OrbitRing.tsx` (замінені на `DrumProjectCard`/drum-карусель), `SpotlightRig.tsx`/`SpotlightControl.tsx`/`HeroSpotlightBar.tsx`/`SpotlightContext.tsx` (весь "прожектор" замінений на `GridScrollContext`/`GridScrollControl`/`HeroGridScrollBar`), `FloatingBackgroundShapes.tsx` (замінена на глобальний `AmbientBackground`).

## Ключові принципи й gotcha's
- **`docs/design-decisions.md` — джерело істини для "чому так", не код і не brief.md.** Кожен великий раунд фідбеку користувача документується як датований "pivot"-запис (тема, що змінилось, чому, які баги знайдено/виправлено). Перед нетривіальною правкою дизайну — прочитай останні pivot-записи, щоб не суперечити вже прийнятим рішенням.
- **Provider-патерн для стану, спільного між хедером і hero-сценою**: `WorldNavContext` / `GridScrollContext` / `ThemeContext` — усі однаковий легкий `useState`+`useMemo` provider, throwing `useX()` хук. Хедер (Server Component `SiteHeader`) живе в root layout вище homepage-дерева. Якщо додаєш ще один спільний стан — повторюй цей самий патерн.
- **`ThemeContext` конкретно**: initial value читається server-side з cookie в `[locale]/layout.tsx` (`next/headers` `cookies()`) і ставиться як `data-theme` на `<html>` ДО гідратації — щоб не було flash неправильної теми (той самий підхід, що й у `locale`-кукі). Світла палітра — `:root[data-theme="light"]` override блок у `globals.css`, поверх дефолтного темного `:root`. Signal/paper токени НЕ змінюються між темами — це fixed-purpose accent, не base-mode токен.
- **`--glass-tint`/`--glass-border`/`--glass-specular` CSS-змінні** — theme-aware заміна хардкоджених `bg-white/[0.06]`-style Tailwind arbitrary values у `GlassPanel` та подібних glass-поверхнях. Використовуй `bg-[var(--glass-tint)]` замість `bg-white/[0.06]` у будь-якому НОВОМУ glass-елементі поза 3D-канвасом (всередині Canvas/BioCard — навпаки, залишай завжди-темний `white/` хардкод, бо hero навмисно не реагує на тему).
- **drei's `Html` `distanceFactor` — контрінтуїтивний напрям**: БІЛЬШЕ число = БІЛЬШИЙ розмір на екрані (не менший, як здається з назви). Якщо збільшуєш CSS-ширину Html-контенту і одночасно піднімаєш `distanceFactor` "для компенсації" — це помножується, а не компенсується, і результат вибухає розміром. Якщо треба зробити елемент N разів більшим на екрані — міняй ЛИШЕ ширину, `distanceFactor` залишай як є.
- **Не вгадувати pixel-бюджети для layout-колізій — вимірювати.** Header-колізії (наприклад, `grid-cols-[1fr_auto_1fr]` з `auto`-колонкою, що росте і виштовхує сусідні `1fr`-колонки, чий вміст не переноситься) траплялись двічі за одну сесію через здогадки. Правильний підхід: запустити throwaway Playwright-скрипт, зробити `getBoundingClientRect()` реальних клікабельних елементів (не просто grid-колонок — їхній bounding box може НЕ включати overflow дочірніх елементів), і рахувати clearance у пікселях перед тим, як вважати фікс завершеним.
- **`min-w-0` на grid/flex-item дозволяє контейнеру бути вужчим за min-content дочірніх елементів — але сам вміст все одно НЕ стискається** (немає `flex-wrap`, немає індивідуального `flex-shrink` на пігулках-кнопках), тож він просто вилазить за межі свого (тепер вужчого) контейнера. Це міняє失failure mode з "вся сторінка отримує горизонтальний скролл" на "вміст візуально накладається на сусідню grid-колонку і блокує кліки" — обидва реальні баги, `min-w-0` сам по собі не "фіксить" тісний layout, лише переміщує симптом.
- **React Compiler purity-правило (`react-hooks/purity`)**: `Math.random()` заборонено в тілі рендеру, включно з ініціалізатором `useRef(...)` (виконується під час рендеру, хоч і один раз). Рандомізовані per-instance значення, які інакше пішли б у `useRef` init, — або константа на module-scope (обчислена раз при імпорті), або справжній рандом всередині `useFrame`/`useEffect` callback (це вже НЕ рендер-фаза, там `Math.random()` ок).
- **Флаг-емодзі (🇬🇧/🇺🇦) на Windows рендеряться як буквальний текст "GB"/"UA"**, не як прапор — Windows історично не постачає color-emoji шрифт, що резолвить regional-indicator-послідовності у прапор-гліфи. Реальні надійні прапори — inline SVG (`FlagIcon.tsx`), не emoji-рядок. Якщо компонент з SVG-іконкою рендериться двічі одночасно в DOM (напр. desktop+mobile рядки хедера, один прихований CSS) — `clipPath`/інші SVG `id`-атрибути мають бути унікальні через `useId()`, інакше дублікат id ламає clip у одній з копій.
- **Next.js client/server boundary pitfall**: якщо експортувати plain-константу (напр. шлях до асету, чи тип типу `ThemeMode`) з `"use client"`-файлу і імпортувати її в Server Component — Next.js підмінює **весь** експорт файлу на proxy/function, і буде `TypeError: The "path" argument must be of type string. Received function`. Спільні plain-data константи й типи (шляхи асетів, `ThemeMode` тощо) тримати в модулях БЕЗ `"use client"` (див. `src/content/assetPaths.ts`, `src/content/types.ts`).
- **Перевірка існування опційних асетів (`hasPortrait`, `hasVideoDark`/`hasVideoLight` тощо) — лише server-side** через `publicAssetExists()` (`src/lib/publicAsset.ts`, `fs.existsSync`), НЕ client-side `fetch(HEAD)`. HEAD-запит до відсутнього файлу все одно логує "Failed to load resource: 404" в консоль (Chrome логує будь-який неуспішний network request незалежно від API) — і `no console errors`-тест (`tests/responsive.spec.ts`) це ловить.
- **Слаги `3d`/`video`/`developers` — зарезервовані** (static routes `/work/{3d,video,developers}` поруч з dynamic `/work/[slug]`). Ніколи не використовувати як `project.slug` — буде permanently shadowed.
- **Кастомний child-компонент, обгорнутий у `React.forwardRef`-подібний callback-ref масив** (`useRef<(Mesh|null)[]>([])` з `ref={(el) => { refs.current[i] = el; }}`) — стандартний патерн цього проєкту для мутації N однотипних 3D/DOM-елементів щокадрово без React-рестейту (drum-карусель, lamp-fade лінії, equalizer-вази, falling donuts). Використовуй його, не `parent.children`, коли треба ітерувати динамічний список мешів/дів кожен кадр.
- **Vertical "drum"/reel-ефекти в DOM (не R3F)** — CSS 3D через `rotateX(angle) translateZ(radius)` на кожній картці (позиція фіксована, не залежить від поточного обертання) всередині батьківської групи, яка сама обертається — а не перерахунок transform кожної картки щокадру. `overflow: hidden` на **найближчому** до 3D-перспективи контейнері, не на далекому предку — 3D-трансформовані елементи можуть "втекти" за межі overflow:hidden предка, якщо він недостатньо близько в дереві (спостережуваний браузерний квірк, не лише теоретичний).
- **Доступність animated show/hide dropdown-контенту** (header Connect, mobile menu): треба ОБИДВА — `tabIndex={open ? 0 : -1}` (керування клавіатурою) І `aria-hidden={!open}` на контейнері (accessibility tree / `getByRole`-запити в тестах). Сам лише `tabIndex` не прибирає елемент з a11y-дерева.
- **`prefers-reduced-motion`** — глобально в `globals.css`, одна media query скорочує всі animation/transition duration до near-zero. Нові анімації (marquee, drift, drum-обертання, typewriter) автоматично це поважають без додаткового коду — але власні `requestAnimationFrame`-цикли (drum, per-world backdrop-рухи) все одно мають explicit-перевіряти `matchMedia("(prefers-reduced-motion: reduce)")` і зупиняти нескінченний цикл (не просто зменшувати тривалість — RAF-цикл сам по собі не CSS-transition, глобальна media query його не чіпає).
- **Не комітити throwaway Playwright-скрипти верифікації** (`tests/_*.spec.ts`) — це усталена конвенція сесії: пишеш одноразовий скрипт для скріншот-перевірки чи `getBoundingClientRect()`-вимірювання, дивишся результат, видаляєш файл (і будь-який `test-results/`-вивід) перед завершенням.

## Команди
```bash
npm run dev      # Next.js dev server (Turbopack), http://localhost:3000
npm run build    # production build + strict TS typecheck
npm run lint     # ESLint
npm test         # Playwright suite (tests/*.spec.ts)
```

## Правила розробки
- Компоненти — функціональні, TypeScript strict, без `any`
- Кольори — Obsidian Signal token-система (не хардкодити hex), per-world акцент через `theme.signal` (`worldTheme.ts`); для light/dark chrome-теми — `--bg`/`--text`/`--surface`-і-т.д. CSS-змінні, не хардкодити hex
- Рядки — завжди через `copy.en.ts`/`copy.uk.ts` (типобезпечно звірені одне з одним через `copy.ts`), без хардкоду тексту
- Shape grammar: рівні глибокі кути для звичайних карток, `rounded-2xl` — **лише** для glass-поверхонь (`GlassPanel`) — свідомий виняток, не системний дрейф
- Нові діаграми кейс-стаді (`components/graphics/`) — кожна отримує власну "shape grammar" під свою тему (flow lines / matrix grid / circular loop / timeline), ніколи не переюзаний один компонент під п'ять різних сюжетів
- Нові одноразові Playwright-скрипти для візуальної перевірки чи pixel-вимірювання — не комітити, видаляти після використання
- Комміти — лише коли користувач явно попросить
