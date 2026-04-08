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
    title: "< 480px",
    label: "Mobile",
    items: [
      "Sidebar скрыт, используется MobileBottomNav",
      "Сетка в одну колонку",
      "Генерация разворачивается аккордеоном",
      "Минимальная высота touch targets: 44px",
    ],
  },
  {
    title: "480–768px",
    label: "Tablet",
    items: [
      "Sidebar сворачивается в иконки",
      "Сетка в две колонки",
      "Тарифы скроллятся по горизонтали",
      "Навигация превращается в табы",
    ],
  },
  {
    title: "> 768px",
    label: "Desktop",
    items: [
      "Sidebar на 220px с текстом",
      "Сетка на 2–3 колонки",
      "Экран генерации работает split panel layout",
      "Дашборд показывает 3 stat-карточки в ряд",
    ],
  },
] as const;
