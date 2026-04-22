import {
  FREE_PLAN_CARDS_PER_MONTH_LABEL,
  FREE_PLAN_CARDS_PER_MONTH_UP_TO_LABEL,
  FREE_PLAN_SUMMARY,
} from "@/shared/config/pricing";

export type HomePricingFeature = {
  label: string;
  enabled: boolean;
};

export type HomePricingPlan = {
  name: string;
  price: string;
  period: string;
  features: ReadonlyArray<HomePricingFeature>;
  popular?: boolean;
  actionLabel: string;
  actionVariant: "primary" | "outline";
  offerPrice: string;
};

export const homePricingPlans: ReadonlyArray<HomePricingPlan> = [
  {
    name: "Старт",
    price: "0 ₽/мес",
    period: `Лимит ${FREE_PLAN_CARDS_PER_MONTH_LABEL}`,
    features: [
      { label: "Для теста сервиса и первых карточек товара", enabled: true },
      { label: FREE_PLAN_CARDS_PER_MONTH_UP_TO_LABEL, enabled: true },
      { label: "Генерация инфографики, фото и текстов", enabled: true },
      { label: "Подходит для знакомства, но не для постоянного потока", enabled: false },
    ],
    actionLabel: "Начать бесплатно",
    actionVariant: "outline",
    offerPrice: "0",
  },
  {
    name: "Бизнес",
    price: "1 490 ₽/мес",
    period: "Лимит 75 карточек в месяц",
    features: [
      { label: "Для регулярной работы селлера с каталогом", enabled: true },
      { label: "До 75 карточек в месяц", enabled: true },
      { label: "Полный доступ к генерации изображений и текстов", enabled: true },
      { label: "Без интеграции по API", enabled: false },
    ],
    popular: true,
    actionLabel: "Подключить",
    actionVariant: "primary",
    offerPrice: "1490",
  },
  {
    name: "Агентство",
    price: "4 990 ₽/мес",
    period: "Лимит 250 карточек в месяц",
    features: [
      { label: "Для агентств и команд с несколькими проектами", enabled: true },
      { label: "До 250 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям сервиса", enabled: true },
      { label: "Приоритетная поддержка", enabled: true },
      { label: "Без интеграции по API", enabled: false },
    ],
    actionLabel: "Подключить",
    actionVariant: "outline",
    offerPrice: "4990",
  },
  {
    name: "Корпоративный",
    price: "14 990 ₽/мес",
    period: "Лимит 750 карточек в месяц",
    features: [
      { label: "Для крупных команд и потоковой генерации карточек", enabled: true },
      { label: "До 750 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям сервиса", enabled: true },
      { label: "Приоритетная поддержка", enabled: true },
      { label: "Интеграция по API", enabled: true },
    ],
    actionLabel: "Подключить",
    actionVariant: "outline",
    offerPrice: "14990",
  },
];

export const homePricingOffers = homePricingPlans.map((plan) => ({
  "@type": "Offer" as const,
  name: plan.name,
  price: plan.offerPrice,
  priceCurrency: "RUB",
}));

export const homeFreePlanSummary = FREE_PLAN_SUMMARY;
export const homePricingNote =
  "Выберите тариф под свой объём каталога: для старта, постоянной работы с карточками товаров или командного потока.";
