import { siteConfig } from "@/shared/config/site";

export type BlogPostEntry = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  canonicalPath: string;
  publishedAt: string;
  updatedAt: string;
  publishedLabel: string;
  updatedLabel: string;
  listMeta: string;
  author: string;
  authorInitials: string;
  readingTime: string;
  views: string;
  heroCaption: string;
  intro: string;
  tags: ReadonlyArray<{
    label: string;
    tone: "wb" | "ozon" | "ym" | "accent";
  }>;
  footerTags: readonly string[];
  keywords: readonly string[];
};

export type BlogCardEntry = {
  tag: string;
  title: string;
  gradient: string;
  href?: string;
};

export type BlogFeedPost = {
  categoryLabel: string;
  title: string;
  excerpt: string;
  meta: string;
  readLabel: string;
  visualClass: "pv1" | "pv2" | "pv3" | "pv4" | "pv5" | "pv6";
  visualLabel: string;
  visualTone: "wb" | "ozon" | "both" | "tips";
  decor: string;
  href?: string;
};

export type BlogListPost = {
  number: string;
  tag: string;
  title: string;
  meta: string;
  href?: string;
};

export type BlogSidebarPost = {
  title: string;
  meta: string;
  href?: string;
};

export type BlogTableCellTone = "success" | "muted";

export type BlogTableContent = {
  head: readonly string[];
  rows: readonly (readonly string[])[];
  cellTones?: readonly (readonly (BlogTableCellTone | null)[])[];
};

export const blogPost: BlogPostEntry = {
  slug: "trebovaniya-foto-marketplejsy-2025",
  title: "Требования к фото для маркетплейсов в 2025 году: WB, Ozon и Яндекс Маркет",
  description:
    "Полный гайд по требованиям к фотографиям для Wildberries, Ozon и Яндекс Маркет в 2025 году. Размеры, фон, ракурсы и правила модерации в одной статье.",
  excerpt:
    "Размеры, фон, ракурсы, количество фото — всё что нужно знать, чтобы карточка прошла модерацию с первого раза и попала в топ выдачи на всех трёх площадках.",
  canonicalPath: "/blog/trebovaniya-foto-marketplejsy-2025",
  publishedAt: "2025-04-03",
  updatedAt: "2025-04-03",
  publishedLabel: "3 апреля 2025",
  updatedLabel: "3 апр 2025",
  listMeta: "3 апр · 10 мин",
  author: "Редакция карточки-онлайн",
  authorInitials: "КО",
  readingTime: "10 мин",
  views: "4 218",
  heroCaption: "Примеры карточек товаров, сгенерированных в kartochki.online",
  intro:
    "Хорошее фото — это половина продажи на маркетплейсе. Но даже идеально снятый товар может не пройти модерацию или плохо ранжироваться, если не соответствует техническим требованиям площадки. В этой статье собрали актуальные требования для Wildberries, Ozon и Яндекс Маркет в одном месте.",
  tags: [
    { label: "Wildberries", tone: "wb" },
    { label: "Ozon", tone: "ozon" },
    { label: "Яндекс Маркет", tone: "ym" },
    { label: "Гайд", tone: "accent" },
  ],
  footerTags: [
    "Wildberries",
    "Ozon",
    "Яндекс Маркет",
    "Требования к фото",
    "Размеры карточек",
    "Инфографика",
    "Модерация",
  ],
  keywords: [
    "требования к фото маркетплейсов",
    "размер фото Wildberries",
    "размер фото Ozon",
    "Яндекс Маркет требования к фото",
    "карточки товаров для маркетплейсов",
  ],
};

export const allBlogPosts = [blogPost] as const;

export const blogPostSlugs = allBlogPosts.map((post) => post.slug);

export const blogHeroStats = [
  { value: "24", label: "статьи" },
  { value: "8к", label: "читателей" },
] as const;

export const blogFilterChips = ["Все", "Wildberries", "Ozon", "Инфографика", "SEO"] as const;

export const blogFeedPosts: readonly BlogFeedPost[] = [
  {
    categoryLabel: "Инфографика",
    title: "Как сделать инфографику для Ozon, которая увеличивает конверсию",
    excerpt: "Разбираем структуру, иконки, тексты и цвета. Примеры, которые работают на карточке товара.",
    meta: "28 мар · 7 мин",
    readLabel: "Читать",
    visualClass: "pv2",
    visualLabel: "Ozon",
    visualTone: "ozon",
    decor: "📊",
  },
  {
    categoryLabel: "Размеры",
    title: "Размеры карточек Wildberries 2025: таблица для всех категорий",
    excerpt: "Актуальные размеры и требования к изображениям для разных типов товаров на Wildberries.",
    meta: "21 мар · 5 мин",
    readLabel: "Читать",
    visualClass: "pv1",
    visualLabel: "Wildberries",
    visualTone: "wb",
    decor: "📐",
  },
  {
    categoryLabel: "Дизайн",
    title: "Белый фон или нет: что лучше работает на маркетплейсах в 2025",
    excerpt: "Сравниваем карточки с белым фоном и lifestyle-съёмкой на WB, Ozon и Маркете.",
    meta: "14 мар · 8 мин",
    readLabel: "Читать",
    visualClass: "pv3",
    visualLabel: "WB + Ozon",
    visualTone: "both",
    decor: "🎨",
  },
  {
    categoryLabel: "Конверсия",
    title: "Почему карточка не продаёт: 7 ошибок, которые допускают 90% продавцов",
    excerpt: "Показываем типовые просчёты в фото, инфографике и тексте, которые снижают продажи.",
    meta: "7 мар · 6 мин",
    readLabel: "Читать",
    visualClass: "pv4",
    visualLabel: "Советы",
    visualTone: "tips",
    decor: "💡",
  },
  {
    categoryLabel: "SEO",
    title: "SEO-оптимизация карточки WB: как попасть в топ без рекламы",
    excerpt: "Ключевые слова, структура контента и описание карточки, которые помогают получать трафик.",
    meta: "28 фев · 9 мин",
    readLabel: "Читать",
    visualClass: "pv5",
    visualLabel: "Wildberries",
    visualTone: "wb",
    decor: "🔍",
  },
  {
    categoryLabel: "Фото",
    title: "Как снять товар на телефон для Ozon: пошаговая инструкция",
    excerpt: "Практичный чеклист по свету, ракурсам и подготовке фото без отдельного фотографа.",
    meta: "20 фев · 5 мин",
    readLabel: "Читать",
    visualClass: "pv6",
    visualLabel: "Ozon",
    visualTone: "ozon",
    decor: "📦",
  },
] as const;

export const moreBlogPosts: readonly BlogListPost[] = [
  {
    number: "07",
    tag: "Wildberries · Требования",
    title: "Модерация карточек WB: почему отклоняют и как пройти с первого раза",
    meta: "12 фев 2025 · 6 мин чтения",
  },
  {
    number: "08",
    tag: "Оба маркетплейса · Дизайн",
    title: "Как создать бренд-шаблон для карточек и держать единый стиль",
    meta: "5 фев 2025 · 7 мин чтения",
  },
  {
    number: "09",
    tag: "Ozon · SEO",
    title: "Rich-контент на Ozon: что это и зачем он нужен каждому продавцу",
    meta: "28 янв 2025 · 8 мин чтения",
  },
  {
    number: "10",
    tag: "WB · Аналитика",
    title: "Как читать аналитику WB и улучшать карточки на основе данных",
    meta: "20 янв 2025 · 10 мин чтения",
  },
  {
    number: "11",
    tag: "Советы · ИИ",
    title: "Как использовать ИИ для создания карточек: реальный опыт продавцов",
    meta: "14 янв 2025 · 5 мин чтения",
  },
] as const;

export const blogCategories = [
  { label: "Wildberries", count: "9" },
  { label: "Ozon", count: "7" },
  { label: "Инфографика", count: "4" },
  { label: "Фото и дизайн", count: "6" },
  { label: "SEO карточки", count: "3" },
  { label: "Конверсия", count: "5" },
] as const;

export const blogPopularPosts: readonly BlogSidebarPost[] = [
  { title: "Требования к фото для WB 2025", meta: "4.2к просмотров", href: blogPost.canonicalPath },
  { title: "Инфографика для Ozon: полный гайд", meta: "3.1к просмотров" },
  { title: "7 ошибок в карточках товаров", meta: "2.8к просмотров" },
  { title: "SEO карточки WB без рекламы", meta: "1.9к просмотров" },
] as const;

export const blogTags = [
  "Wildberries",
  "Ozon",
  "Фото товара",
  "Инфографика",
  "Белый фон",
  "Размеры",
  "Модерация",
  "SEO",
  "Rich-контент",
  "Конверсия",
  "ИИ генерация",
] as const;

export const relatedPosts: readonly BlogCardEntry[] = [
  {
    tag: "Инфографика",
    title: "Как сделать инфографику для Ozon, которая увеличивает конверсию",
    gradient: "linear-gradient(135deg, #fef3e2, #fdd89a)",
  },
  {
    tag: "SEO",
    title: "SEO-оптимизация карточки WB: как попасть в топ без рекламы",
    gradient: "linear-gradient(135deg, #e8f4fd, #b3d9f7)",
  },
  {
    tag: "Конверсия",
    title: "7 ошибок в карточках товаров, которые допускают 90% продавцов",
    gradient: "linear-gradient(135deg, #e8f8f2, #95d5b2)",
  },
  {
    tag: "Фото",
    title: "Как снять товар на телефон: пошаговая инструкция",
    gradient: "linear-gradient(135deg, #fce8e8, #f5a3a3)",
  },
];

export const popularPosts = [
  "Инфографика для Ozon: полный гайд",
  "7 ошибок в карточках товаров",
  "SEO карточки WB без рекламы",
  "Rich-контент на Ozon: что это",
] as const;

export const breadcrumbItems = [
  { label: "Главная", href: "/" },
  { label: "Блог", href: "/blog" },
  { label: "Требования к фото для маркетплейсов 2025" },
] as const;

export const tocItems = [
  { id: "overview", label: "Сравнение площадок" },
  { id: "wildberries", label: "Wildberries" },
  { id: "wb-sizes", label: "Размеры и параметры", level: 2 },
  { id: "wb-rules", label: "Что запрещено", level: 2 },
  { id: "ozon", label: "Ozon" },
  { id: "ozon-sizes", label: "Размеры и форматы", level: 2 },
  { id: "yandex", label: "Яндекс Маркет" },
  { id: "ym-sizes", label: "Размеры", level: 2 },
  { id: "ym-special", label: "Особенности", level: 2 },
  { id: "how-to", label: "Как подготовить фото" },
  { id: "comparison", label: "Сравнительная таблица" },
  { id: "faq", label: "Частые вопросы" },
] as const;

export const heroGradients = [
  "linear-gradient(135deg, #0f3460, #e94560)",
  "linear-gradient(135deg, #1a472a, #52b788)",
  "linear-gradient(135deg, #2d1b69, #f5a623)",
  "linear-gradient(135deg, #2c3e50, #f39c12)",
  "linear-gradient(135deg, #6a0572, #e040fb)",
  "linear-gradient(135deg, #1b4332, #95d5b2)",
] as const;

export const overviewCards = [
  {
    name: "Wildberries",
    tone: "wb" as const,
    specs: [
      ["Размер", "1000×1500 px"],
      ["Соотношение", "2:3"],
      ["Фон", "Любой"],
      ["Формат", "JPG, PNG"],
      ["Макс. размер", "8 МБ"],
    ],
  },
  {
    name: "Ozon",
    tone: "ozon" as const,
    specs: [
      ["Размер", "1200×1200 px"],
      ["Соотношение", "1:1"],
      ["Фон", "Белый (главное)"],
      ["Формат", "JPG, PNG, WEBP"],
      ["Макс. размер", "10 МБ"],
    ],
  },
  {
    name: "Яндекс Маркет",
    tone: "ym" as const,
    specs: [
      ["Размер", "от 800×800 px"],
      ["Соотношение", "1:1 рекомендуется"],
      ["Фон", "Белый (главное)"],
      ["Формат", "JPG, PNG"],
      ["Макс. размер", "10 МБ"],
    ],
  },
] as const;

export const callouts = {
  overview: {
    tone: "tip" as const,
    title: "Совет:",
    text: "если вы продаёте на всех трёх площадках, снимайте в разрешении 1500×1500 пикселей — это универсальный размер, из которого можно подготовить версии под любые требования без потери качества.",
  },
  wildberries: {
    tone: "warn" as const,
    title: "Важно:",
    text: "с 2024 года WB автоматически проверяет соотношение сторон. Фото 1:1 или 3:4 будут обрезаны или отклонены автоматически, без ручной модерации.",
  },
  ozon: {
    tone: "info" as const,
    title: "Rich-контент Ozon:",
    text: "помимо обычных фото, Ozon поддерживает Rich-контент — расширенные карточки с видео, текстовыми блоками и инфографикой. Такие карточки обычно конвертируют на 15–25% лучше.",
  },
} as const;

export const wildberriesTable = {
  head: ["Параметр", "Минимум", "Рекомендуется", "Максимум"],
  rows: [
    ["Ширина", "900 px", "1000 px", "—"],
    ["Высота", "1200 px", "1500 px", "—"],
    ["Соотношение сторон", "2:3 строго", "2:3 строго", "2:3 строго"],
    ["Размер файла", "—", "до 3 МБ", "8 МБ"],
    ["Количество фото", "1", "6–9", "30"],
  ],
} as const;

export const ozonTable = {
  head: ["Параметр", "Главное фото", "Дополнительные"],
  rows: [
    ["Минимальный размер", "1200×1200 px", "800×800 px"],
    ["Рекомендуется", "1600×1600 px", "1200×1200 px"],
    ["Фон", "Белый (RGB 235–255)", "Любой"],
    ["Форматы", "JPG, PNG, WEBP", "JPG, PNG, WEBP"],
    ["Количество", "до 15 фото", "до 15 фото"],
  ],
} as const;

export const yandexTable: BlogTableContent = {
  head: ["Параметр", "Требование", "Примечание"],
  rows: [
    ["Минимальный размер", "800×800 px", "Рекомендуется 1200×1200"],
    ["Соотношение сторон", "1:1 рекомендуется", "Допускается 3:4 и 4:3"],
    ["Фон главного фото", "Белый", "RGB не ниже 200"],
    ["Форматы", "JPG, PNG", "PNG без прозрачности"],
    ["Количество фото", "до 30", "Рекомендуется 5–10"],
    ["Видео", "✓ Поддерживается", "до 5 минут, MP4"],
  ],
  cellTones: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, "success", null],
  ],
} as const;

export const comparisonTable: BlogTableContent = {
  head: ["Требование", "Wildberries", "Ozon", "Яндекс Маркет"],
  rows: [
    ["Мин. размер", "900×1200", "1200×1200", "800×800"],
    ["Рекомендуется", "1000×1500", "1600×1600", "1200×1200"],
    ["Соотношение", "2:3 (строго)", "1:1", "1:1 (рек.)"],
    ["Белый фон", "Не обязательно", "Обязательно (главное)", "Обязательно (главное)"],
    ["Макс. кол-во фото", "30", "15", "30"],
    ["Видео", "✓", "✓", "✓"],
    ["Инфографика", "✓ (доп. фото)", "✓ (Rich-контент)", "✓ (доп. фото)"],
    ["360° фото", "—", "—", "✓"],
    ["Макс. размер файла", "8 МБ", "10 МБ", "10 МБ"],
  ],
  cellTones: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, "muted", "success", "success"],
    [null, null, null, null],
    [null, "success", "success", "success"],
    [null, "success", "success", "success"],
    [null, "muted", "muted", "success"],
    [null, null, null, null],
  ],
};

export const bannedOnWildberries = [
  "Водяные знаки и логотипы других брендов.",
  "Рамки и границы вокруг изображения.",
  "Текст, занимающий более 30% площади главного фото.",
  "Коллажи из нескольких товаров на главном фото.",
  "Изображения низкого качества: размытые или пиксельные.",
] as const;

export const yandexFeatures = [
  "360° фото — Маркет поддерживает интерактивные изображения с поворотом. Это заметно повышает конверсию в карточке.",
  "Видео — можно загружать напрямую или добавлять через ссылку на YouTube.",
  "3D-модели — доступны для категорий мебели и техники.",
  "Авто-генерация фона — Маркет может заменить фон на белый, но результат часто хуже ручной обработки.",
] as const;

export const preparationSteps = [
  {
    title: "Снять товар в правильном ракурсе",
    description:
      "Главное фото — фронтальный вид или 3/4. Дополнительные — все стороны, детали, масштаб рядом с рукой или знакомым предметом.",
  },
  {
    title: "Удалить фон или заменить на нужный",
    description:
      "Для Ozon и Яндекс Маркет на главном фото нужен белый фон. Если съёмка была на сложном фоне, лучше убрать его до загрузки.",
  },
  {
    title: "Привести к нужному размеру и соотношению",
    description:
      "WB — 1000×1500 (2:3), Ozon и Яндекс Маркет — квадратные форматы. Не растягивайте кадр: добавляйте поля или готовьте отдельные версии.",
  },
  {
    title: "Добавить инфографику",
    description:
      "Состав, размеры, ключевые преимущества и сценарии использования — карточки с инфографикой обычно конвертируют на 20–35% лучше.",
  },
  {
    title: "Проверить и загрузить",
    description:
      "Проверьте размер файла, порядок фото, наличие артефактов после обработки и соответствие площадке перед публикацией.",
  },
] as const;

export const faqItems = [
  {
    question: "Можно ли использовать одно фото для всех трёх площадок?",
    answer:
      "Технически да, но это не лучший вариант. У WB строгое соотношение 2:3, у Ozon и Яндекс Маркет лучше работают квадратные форматы. Практичнее готовить минимум две версии: вертикальную для WB и квадратную для Ozon и Маркета.",
  },
  {
    question: "Нужен ли белый фон для Wildberries?",
    answer:
      "Нет, WB не требует белого фона. Но на практике светлый и чистый фон часто помогает карточке выглядеть аккуратнее и лучше конвертировать, особенно в конкурентных категориях.",
  },
  {
    question: "Что лучше: снять на телефон или заказать фотографа?",
    answer:
      "Современного смартфона достаточно для большинства карточек, если есть хороший свет и базовая постобработка. Профессиональный фотограф нужен, когда товар дорогой, нужна lifestyle-съёмка или вы строите премиальный бренд.",
  },
] as const;

export function getBlogPostBySlug(slug: string) {
  return allBlogPosts.find((post) => post.slug === slug) ?? null;
}
