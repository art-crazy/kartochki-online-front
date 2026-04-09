export type DashboardStat = {
  label: string;
  value: string;
  description: string;
  accentText?: string;
  progress?: {
    value: number;
    max: number;
    valueLabel: string;
  };
};

export type DashboardProject = {
  id: string;
  title: string;
  cardCount: number;
  marketplace: "wildberries" | "ozon";
  updatedAt: string;
  previews: readonly [string, string, string];
  href: string;
};

export const dashboardStats: ReadonlyArray<DashboardStat> = [
  {
    label: "Карточек создано",
    value: "7 / 10",
    description: "Осталось",
    accentText: "3 карточки",
    progress: {
      value: 7,
      max: 10,
      valueLabel: "7 из 10",
    },
  },
  {
    label: "Проектов",
    value: "3",
    description: "Wildberries: 2 · Ozon: 1",
  },
  {
    label: "Тариф",
    value: "Бесплатный",
    description: "Обновление лимита 1 мая",
  },
];

export const recentProjects: ReadonlyArray<DashboardProject> = [
  {
    id: "nike-air-max",
    title: "Кроссовки Nike Air Max",
    cardCount: 6,
    marketplace: "wildberries",
    updatedAt: "2 дня назад",
    previews: [
      "linear-gradient(135deg, #0f3460, #e94560)",
      "linear-gradient(135deg, #1a472a, #52b788)",
      "linear-gradient(135deg, #2d1b69, #f5a623)",
    ],
    href: "/app",
  },
  {
    id: "hand-cream",
    title: "Крем для рук увлажняющий",
    cardCount: 8,
    marketplace: "ozon",
    updatedAt: "5 дней назад",
    previews: [
      "linear-gradient(135deg, #2c3e50, #f39c12)",
      "linear-gradient(135deg, #6a0572, #e040fb)",
      "linear-gradient(135deg, #1b4332, #95d5b2)",
    ],
    href: "/app",
  },
];

export const allProjects: ReadonlyArray<DashboardProject> = [
  ...recentProjects,
  {
    id: "leather-bag",
    title: "Сумка кожаная женская",
    cardCount: 6,
    marketplace: "wildberries",
    updatedAt: "1 неделю назад",
    previews: [
      "linear-gradient(135deg, #c0392b, #e74c3c)",
      "linear-gradient(135deg, #1a1a2e, #16213e)",
      "linear-gradient(135deg, #2c3e50, #bdc3c7)",
    ],
    href: "/app",
  },
];

export const quickStartContent = {
  title: "Создайте карточки прямо сейчас",
  description: "Загрузите фото товара и получите готовый набор карточек для Wildberries или Ozon за 30 секунд.",
  href: "/app/generate",
};
