export type BillingPlanFeature = {
  label: string;
  enabled: boolean;
};

export type BillingPlan = {
  id: string;
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

export type BillingSubscriptionSummary = {
  canCancel: boolean;
  planName: string;
  renewalLabel: string;
  paymentLabel: string;
  usage: {
    value: number;
    max: number;
  };
};

export type BillingPageContent = {
  currentSubscription: BillingSubscriptionSummary;
  plans: ReadonlyArray<BillingPlan>;
  addons: ReadonlyArray<BillingAddon>;
};

export const billingFaqItems = [
  {
    title: "Можно ли отменить подписку в любой момент?",
    content: "Да. Подписку можно отключить в любой момент, а оплаченные функции останутся доступны до конца периода.",
  },
  {
    title: "Что происходит с карточками после отмены?",
    content: "Созданные материалы остаются в аккаунте. После окончания периода лимит возвращается к возможностям бесплатного плана.",
  },
  {
    title: "Как работают разовые пакеты карточек?",
    content: "Разовые пакеты суммируются с тарифом и не сгорают. Их можно докупать, когда нужен дополнительный объем.",
  },
  {
    title: "Какие способы оплаты поддерживаются?",
    content: "Доступные способы оплаты определяются платежным провайдером и открываются на странице checkout.",
  },
] as const;
