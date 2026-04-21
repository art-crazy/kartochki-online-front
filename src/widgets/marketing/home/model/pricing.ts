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
    period: "Лимит 5 карточек в месяц",
    features: [
      { label: "Для теста сервиса и первых запусков", enabled: true },
      { label: "До 5 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям", enabled: true },
      { label: "Не для постоянной работы с каталогом", enabled: false },
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
      { label: "Для регулярной работы с каталогом", enabled: true },
      { label: "До 75 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям", enabled: true },
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
      { label: "Для агентств и команд с несколькими клиентами", enabled: true },
      { label: "До 250 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям", enabled: true },
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
      { label: "Для крупных команд и автоматизации процессов", enabled: true },
      { label: "До 750 карточек в месяц", enabled: true },
      { label: "Полный доступ ко всем функциям", enabled: true },
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

export const homeFreePlanSummary = "5 карточек бесплатно, без карты, отмена в любой момент.";
export const homePricingNote = "Выберите тариф под свой сценарий работы и нужный месячный объем карточек.";
