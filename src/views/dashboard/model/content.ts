import { FREE_PLAN_CARD_LIMIT, formatCardsLabel } from "@/shared/config/pricing";

export type DashboardStatVariant = "usage" | "default" | "tariff";

export type DashboardStat = {
  label: string;
  value: string;
  valueParts?: {
    primary: string;
    secondary: string;
  };
  description: string;
  accentText?: string;
  variant?: DashboardStatVariant;
  progress?: {
    value: number;
    max: number;
  };
};

export type DashboardProject = {
  id: string;
  title: string;
  cardCount: number;
  marketplace: string;
  updatedAt: string;
  previewUrls: readonly string[];
  href: string;
};

export type DashboardQuickStart = {
  title: string;
  description: string;
  href: string;
};

export type DashboardPageContent = {
  stats: ReadonlyArray<DashboardStat>;
  recentProjects: ReadonlyArray<DashboardProject>;
  allProjects: ReadonlyArray<DashboardProject>;
  quickStart: DashboardQuickStart;
};

const FREE_PLAN_USED_CARDS_DEMO = 3;
const FREE_PLAN_REMAINING_CARDS_DEMO = FREE_PLAN_CARD_LIMIT - FREE_PLAN_USED_CARDS_DEMO;

export const dashboardStats: ReadonlyArray<DashboardStat> = [
  {
    label: "Карточек создано",
    value: `${FREE_PLAN_USED_CARDS_DEMO}/${FREE_PLAN_CARD_LIMIT}`,
    valueParts: {
      primary: String(FREE_PLAN_USED_CARDS_DEMO),
      secondary: `/ ${FREE_PLAN_CARD_LIMIT}`,
    },
    description: "осталось",
    accentText: formatCardsLabel(FREE_PLAN_REMAINING_CARDS_DEMO),
    variant: "usage",
    progress: {
      value: FREE_PLAN_USED_CARDS_DEMO,
      max: FREE_PLAN_CARD_LIMIT,
    },
  },
  {
    label: "Проектов",
    value: "3",
    description: "WB: 2 · Ozon: 1",
    variant: "default",
  },
  {
    label: "Тариф",
    value: "Бесплатный",
    description: "Обновляется 1 мая",
    variant: "tariff",
  },
];

export const recentProjects: ReadonlyArray<DashboardProject> = [
  {
    id: "nike-air-max",
    title: "Кроссовки Nike Air Max",
    cardCount: 6,
    marketplace: "wildberries",
    updatedAt: "2 дня назад",
    previewUrls: [],
    href: "/app",
  },
  {
    id: "hand-cream",
    title: "Крем для рук увлажняющий",
    cardCount: 8,
    marketplace: "ozon",
    updatedAt: "5 дней назад",
    previewUrls: [],
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
    previewUrls: [],
    href: "/app",
  },
];

export const quickStartContent = {
  title: "Создай карточки прямо сейчас",
  description: "Загрузи фото товара — получи 6 готовых карточек для WB или Ozon за 30 секунд",
  href: "/app/generate",
};

export const fallbackDashboardContent: DashboardPageContent = {
  stats: dashboardStats,
  recentProjects,
  allProjects,
  quickStart: quickStartContent,
};
