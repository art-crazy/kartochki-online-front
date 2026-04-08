export const marketplaceBadges = [
  { label: "Wildberries", tone: "wb" as const },
  { label: "Ozon", tone: "ozon" as const },
  { label: "Яндекс Маркет", tone: "ym" as const },
];

export const mockupPreviews = [
  { label: "Главная", gradient: "linear-gradient(160deg, #28406f, #e2405f)" },
  { label: "Инфографика", gradient: "linear-gradient(160deg, #216236, #57b98b)" },
  { label: "Состав", gradient: "linear-gradient(160deg, #523175, #e39c26)" },
  { label: "Размеры", gradient: "linear-gradient(160deg, #495660, #f3a10a)" },
  { label: "Детали", gradient: "linear-gradient(160deg, #851297, #d13ae6)" },
  { label: "Преимущества", gradient: "linear-gradient(160deg, #356b4f, #94d7b7)" },
];

export const mockupStyleOptions = ["Минимализм", "Яркий", "Тёмный"];

export const marqueeItems = [
  "Wildberries",
  "Ozon",
  "Яндекс Маркет",
  "ИИ-генерация",
  "Инфографика",
  "Удаление фона",
  "Batch 50 шт",
  "Требования площадок",
];

export const testimonials = [
  {
    quote:
      "Раньше тратила 2–3 часа на оформление одного товара. Теперь весь сет за 5 минут. Карточки прошли модерацию WB с первого раза.",
    initials: "АС",
    name: "Анна С.",
    category: "Одежда и аксессуары",
    tone: "wb" as const,
    gradient: 1 as const,
  },
  {
    quote:
      "Подключил Яндекс Маркет и удивился: сервис сам знает нужные размеры и фон для каждой площадки. Больше не нужно помнить требования.",
    initials: "МК",
    name: "Михаил К.",
    category: "Электроника",
    tone: "ym" as const,
    gradient: 2 as const,
  },
  {
    quote:
      "Batch-генерация реально экономит время. Загрузил 40 фото косметики, через 15 минут все карточки готовы для Ozon. Конверсия выросла на 18%.",
    initials: "ЕП",
    name: "Елена П.",
    category: "Косметика",
    tone: "ozon" as const,
    gradient: 3 as const,
  },
];

export const steps = [
  {
    number: "01",
    title: "Загрузите фото товара",
    description:
      "Подойдёт снимок на столе, в руке или на нейтральном фоне. Сервис улучшит качество, уберёт шум и аккуратно вырежет объект.",
  },
  {
    number: "02",
    title: "Выберите площадку и стиль",
    description:
      "Для Wildberries, Ozon и Яндекс Маркета автоматически применяются правильные размеры, фон, композиция и ограничения на контент.",
  },
  {
    number: "03",
    title: "Скачайте готовый набор",
    description:
      "Получите комплект карточек с главным фото, инфографикой, блоками с преимуществами, размерами и составом. Всё готово к публикации.",
  },
];

export const platformCards = [
  {
    icon: "WB",
    label: "Wildberries",
    tone: "wb" as const,
    meta: "1000×1500 · 2:3 · до 30 фото",
    specs: [
      "Любой фон для главного фото",
      "Автоматическое соотношение 2:3",
      "Инфографика по требованиям WB",
      "Batch-генерация до 50 карточек",
      "Соответствие модерации с первого раза",
    ],
  },
  {
    icon: "OZ",
    label: "Ozon",
    tone: "ozon" as const,
    meta: "1200×1200 · 1:1 · белый фон",
    specs: [
      "Белый фон в диапазоне RGB 235–255",
      "Размеры 1200×1200 и 1600×1600",
      "Поддержка rich-контента",
      "Инфографика в стиле Ozon",
      "До 15 фото на карточку",
    ],
  },
  {
    icon: "ЯМ",
    label: "Яндекс Маркет",
    tone: "ym" as const,
    meta: "от 800×800 · белый фон · до 30 фото",
    specs: [
      "Рекомендуемые размеры 1200×1200",
      "Белый фон без серого налёта",
      "Поддержка JPG и PNG",
      "Оптимизация под поиск Яндекса",
      "До 30 фото на карточку",
    ],
  },
];

export const featureCards = [
  {
    icon: "✦",
    title: "Автоматические требования площадок",
    description:
      "Размеры, фоны, поля безопасности и правила оформления подставляются автоматически после выбора маркетплейса.",
  },
  {
    icon: "⚡",
    title: "Batch-генерация до 50 карточек",
    description:
      "Загрузите папку с фотографиями и получите готовые сеты сразу для всего каталога без ручной вёрстки каждого товара.",
  },
  {
    icon: "◎",
    title: "Удаление фона за секунды",
    description:
      "Не нужен предметный фотограф. Сервис вырежет товар, выровняет композицию и подготовит фон под требования площадки.",
  },
  {
    icon: "▦",
    title: "Шаблоны инфографики с высокой конверсией",
    description:
      "Подсветка преимуществ, составов, размеров и сценариев использования уже встроена в шаблоны и легко адаптируется под категорию.",
  },
  {
    icon: "↯",
    title: "ИИ-копирайтинг для описаний",
    description:
      "Название, описание и ключевые фразы формируются отдельно под Wildberries, Ozon и Яндекс Маркет с учётом поискового спроса.",
  },
  {
    icon: "⌘",
    title: "Бренд-шаблоны и единый стиль",
    description:
      "Сохраните фирменные цвета, шрифты и паттерны, чтобы новые карточки автоматически выглядели как часть одной линейки.",
  },
];

export const stats = [
  { value: "800", accent: "+", label: "продавцов уже используют сервис" },
  { value: "3", accent: "", label: "маркетплейса поддерживается из коробки" },
  { value: "30", accent: "с", label: "до готового набора карточек" },
  { value: "18", accent: "%", label: "средний рост конверсии по кейсам" },
];

export const pricingPlans = [
  {
    name: "Старт",
    price: "0 ₽",
    period: "Навсегда бесплатно",
    popular: false,
    features: [
      { label: "10 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "WB, Ozon и Яндекс Маркет", enabled: true },
      { label: "3 стиля оформления", enabled: true },
      { label: "Batch-генерация", enabled: false },
      { label: "ИИ-копирайтинг", enabled: false },
      { label: "Бренд-шаблоны", enabled: false },
    ],
    actionLabel: "Начать бесплатно",
    actionVariant: "outline" as const,
  },
  {
    name: "Про",
    price: "490 ₽/мес",
    period: "50 карточек в месяц",
    popular: true,
    features: [
      { label: "50 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "WB, Ozon и Яндекс Маркет", enabled: true },
      { label: "Все стили", enabled: true },
      { label: "Batch до 20 товаров", enabled: true },
      { label: "ИИ-копирайтинг", enabled: true },
      { label: "Бренд-шаблоны", enabled: false },
    ],
    actionLabel: "Подключить",
    actionVariant: "primary" as const,
  },
  {
    name: "Бизнес",
    price: "990 ₽/мес",
    period: "200 карточек в месяц",
    popular: false,
    features: [
      { label: "200 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "WB, Ozon и Яндекс Маркет", enabled: true },
      { label: "Все стили", enabled: true },
      { label: "Batch до 50 товаров", enabled: true },
      { label: "ИИ-копирайтинг", enabled: true },
      { label: "Бренд-шаблоны", enabled: true },
    ],
    actionLabel: "Подключить",
    actionVariant: "outline" as const,
  },
];

export const blogPosts = [
  {
    title: "Требования к фото для WB, Ozon и Яндекс Маркет: полный гайд",
    meta: "3 апр · 10 мин",
    tag: "Wildberries",
    tone: "wb" as const,
    gradient: "linear-gradient(135deg, #e8f4fd, #b3d9f7)",
  },
  {
    title: "Как сделать инфографику для Ozon, которая увеличивает конверсию",
    meta: "28 мар · 7 мин",
    tag: "Ozon",
    tone: "ozon" as const,
    gradient: "linear-gradient(135deg, #fef3e2, #fdd89a)",
  },
  {
    title: "7 ошибок в карточках товаров, которые допускают 90% продавцов",
    meta: "7 мар · 6 мин",
    tag: "WB + Ozon + ЯМ",
    tone: "accent" as const,
    gradient: "linear-gradient(135deg, #e8f8f2, #95d5b2)",
  },
];

export const faqItems = [
  {
    title: "Подходит ли сервис для любых категорий товаров?",
    content:
      "Да. Сервис подходит для одежды, электроники, косметики, товаров для дома, детских товаров и других категорий. ИИ адаптирует стиль инфографики и структуру карточек под тип товара автоматически.",
  },
  {
    title: "Карточки соответствуют требованиям Wildberries, Ozon и Яндекс Маркет?",
    content:
      "Да. Мы учитываем требования площадок к размерам, фону, количеству фото и композиции. Это снижает риск отклонения модерацией и экономит время на ручных проверках.",
  },
  {
    title: "Можно ли загружать фото среднего качества?",
    content:
      "Да, если снимок сделан при нормальном освещении и товар различим. Сервис улучшает резкость, убирает шум и помогает подготовить исходник к публикации.",
  },
  {
    title: "Что будет, если лимит карточек закончится раньше конца месяца?",
    content:
      "Можно докупить дополнительный пакет карточек или перейти на следующий тариф. Неиспользованный остаток не сгорает при апгрейде.",
  },
];
