export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const marketplaceOptions = [
  { value: "wildberries", label: "Wildberries", shortLabel: "WB", tone: "wb" as const },
  { value: "ozon", label: "Ozon", shortLabel: "Ozon", tone: "ozon" as const },
  { value: "yandex-market", label: "Яндекс Маркет", shortLabel: "Маркет", tone: "ym" as const },
] as const;

export const gradientPresets = [
  "linear-gradient(135deg, #ff8855 0%, #f4d06f 100%)",
  "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
  "linear-gradient(135deg, #d66efd 0%, #8a4fff 100%)",
  "linear-gradient(135deg, #7ee8fa 0%, #80ff72 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
] as const;

export const mobileRules = [
  {
    icon: "📱",
    title: "< 480px",
    label: "Mobile",
    items: [
      "Sidebar → скрыт, MobileBottomNav",
      "Все кнопки → btn-block",
      "Сетка → 1 колонка",
      "Генерация → стэк (сверху вниз)",
      "Touch target min-height → 44px",
      "Настройки → horizontal chips",
    ],
  },
  {
    icon: "💻",
    title: "480–768px",
    label: "Tablet",
    items: [
      "Sidebar → drawer по кнопке ☰",
      "Сетка → 2 колонки",
      "Тарифы → вертикальный стэк",
      "Карточки результата → 2 в ряд",
      "Навигация → MobileBottomNav",
    ],
  },
  {
    icon: "🖥",
    title: "> 768px",
    label: "Desktop",
    items: [
      "Sidebar → 220px с текстом",
      "Сетка → 2–3 колонки",
      "Генерация → split panel",
      "Дашборд → 3 стат-карточки",
      "Настройки → вертикальный nav",
    ],
  },
] as const;
