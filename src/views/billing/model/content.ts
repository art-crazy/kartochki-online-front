export type BillingPlanFeature = {
  label: string;
  enabled: boolean;
};

export type BillingPlan = {
  id: "start" | "pro" | "business";
  name: string;
  monthlyPrice: number;
  monthlyPriceLabel: string;
  yearlyMonthlyPrice?: number;
  yearlySavingsLabel?: string;
  monthlyPeriodLabel: string;
  yearlyPeriodLabel?: string;
  monthlyCheckoutLabel: string;
  yearlyCheckoutLabel?: string;
  cardsPerMonth: number;
  features: ReadonlyArray<BillingPlanFeature>;
  current?: boolean;
  popular?: boolean;
  ctaLabel: string;
  ctaVariant: "current" | "accent" | "outline";
};

export type BillingAddon = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
};

export const currentSubscription = {
  planName: "Бесплатный план",
  renewalLabel: "Обновление лимита 1 мая",
  paymentLabel: "Платёжные данные не добавлены",
  usage: {
    value: 7,
    max: 10,
  },
};

export const billingPlans: ReadonlyArray<BillingPlan> = [
  {
    id: "start",
    name: "Старт",
    monthlyPrice: 0,
    monthlyPriceLabel: "0 ₽",
    monthlyPeriodLabel: "Навсегда бесплатно",
    monthlyCheckoutLabel: "0 ₽",
    cardsPerMonth: 10,
    current: true,
    ctaLabel: "Текущий план",
    ctaVariant: "current",
    features: [
      { label: "10 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "3 стиля оформления", enabled: true },
      { label: "Wildberries и Ozon", enabled: true },
      { label: "Batch-генерация", enabled: false },
      { label: "AI-копирайтинг", enabled: false },
      { label: "Бренд-шаблоны", enabled: false },
    ],
  },
  {
    id: "pro",
    name: "Про",
    monthlyPrice: 490,
    monthlyPriceLabel: "490 ₽/мес",
    yearlyMonthlyPrice: 392,
    yearlySavingsLabel: "Экономия 20%",
    monthlyPeriodLabel: "50 карточек в месяц",
    yearlyPeriodLabel: "4 704 ₽ в год",
    monthlyCheckoutLabel: "490 ₽",
    yearlyCheckoutLabel: "4 704 ₽",
    cardsPerMonth: 50,
    popular: true,
    ctaLabel: "Перейти на Про",
    ctaVariant: "accent",
    features: [
      { label: "50 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "Все стили оформления", enabled: true },
      { label: "Wildberries и Ozon", enabled: true },
      { label: "Batch до 20 штук", enabled: true },
      { label: "AI-копирайтинг", enabled: true },
      { label: "Бренд-шаблоны", enabled: false },
    ],
  },
  {
    id: "business",
    name: "Бизнес",
    monthlyPrice: 990,
    monthlyPriceLabel: "990 ₽/мес",
    yearlyMonthlyPrice: 792,
    yearlySavingsLabel: "Экономия 20%",
    monthlyPeriodLabel: "200 карточек в месяц",
    yearlyPeriodLabel: "9 504 ₽ в год",
    monthlyCheckoutLabel: "990 ₽",
    yearlyCheckoutLabel: "9 504 ₽",
    cardsPerMonth: 200,
    ctaLabel: "Подключить",
    ctaVariant: "outline",
    features: [
      { label: "200 карточек в месяц", enabled: true },
      { label: "Удаление фона", enabled: true },
      { label: "Все стили оформления", enabled: true },
      { label: "Wildberries и Ozon", enabled: true },
      { label: "Batch до 50 штук", enabled: true },
      { label: "AI-копирайтинг", enabled: true },
      { label: "Бренд-шаблоны", enabled: true },
    ],
  },
];

export const billingAddons: ReadonlyArray<BillingAddon> = [
  {
    id: "cards-20",
    title: "+20 карточек",
    description: "Разовый пакет, который не сгорает в конце месяца.",
    priceLabel: "150 ₽",
  },
  {
    id: "cards-50",
    title: "+50 карточек",
    description: "Подходит для сезонного расширения объёма генераций.",
    priceLabel: "299 ₽",
  },
  {
    id: "cards-100",
    title: "+100 карточек",
    description: "Для больших выгрузок и работы нескольких менеджеров.",
    priceLabel: "499 ₽",
  },
];

export const billingFaqItems = [
  {
    title: "Можно ли отменить подписку в любой момент?",
    content: "Да. Подписку можно отключить в любой момент, а платные функции останутся доступны до конца оплаченного периода.",
  },
  {
    title: "Что происходит с карточками после отмены?",
    content: "Все созданные материалы остаются в аккаунте. После окончания периода лимит просто вернётся к возможностям бесплатного плана.",
  },
  {
    title: "Как работают разовые пакеты карточек?",
    content: "Разовые пакеты суммируются с вашим тарифом и не сгорают. Их можно докупать тогда, когда нужен дополнительный объём.",
  },
  {
    title: "Какие способы оплаты планируются?",
    content: "На странице показан будущий сценарий с онлайн-оплатой. Пока кнопки работают как демо и ведут к заглушке без реального списания.",
  },
] as const;
