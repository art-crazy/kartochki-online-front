import type {
  BillingAddon as ApiBillingAddon,
  BillingPlan as ApiBillingPlan,
  BillingResponse,
  BillingSubscription,
} from "@/shared/api";
import type {
  BillingAddon,
  BillingPageContent,
  BillingPlan,
  BillingSubscriptionSummary,
} from "./content";

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "RUB",
});

export function mapBillingResponse(response: BillingResponse): BillingPageContent {
  return {
    currentSubscription: mapSubscription(response.current_subscription),
    plans: response.plans
      .filter((plan) => plan.id !== "test")
      .map((plan) => mapPlan(plan, response.current_subscription.plan_id)),
    addons: response.addons.map(mapAddon),
  };
}

function mapSubscription(subscription: BillingSubscription): BillingSubscriptionSummary {
  return {
    canCancel: subscription.has_payment_method && !subscription.cancels_at,
    planId: subscription.plan_id,
    planName: subscription.plan_name,
    renewalLabel: getRenewalLabel(subscription),
    paymentLabel: subscription.has_payment_method
      ? "Платежные данные добавлены"
      : "Платежные данные не добавлены",
    usage: subscription.usage,
  };
}

function mapPlan(plan: ApiBillingPlan, currentPlanId: string): BillingPlan {
  const current = plan.current ?? plan.id === currentPlanId;
  const yearlySavings = getYearlySavings(plan.monthly_price, plan.yearly_monthly_price);

  return {
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthly_price,
    monthlyPriceLabel: getMonthlyPriceLabel(plan.monthly_price),
    yearlyMonthlyPrice: plan.yearly_monthly_price,
    yearlySavingsLabel: yearlySavings ? `Экономия ${yearlySavings}%` : undefined,
    monthlyPeriodLabel: getCardsPeriodLabel(plan.cards_per_month),
    yearlyPeriodLabel: plan.yearly_monthly_price
      ? `${formatRub(plan.yearly_monthly_price * 12)} в год`
      : undefined,
    monthlyCheckoutLabel: formatRub(plan.monthly_price),
    yearlyCheckoutLabel: plan.yearly_monthly_price
      ? formatRub(plan.yearly_monthly_price * 12)
      : undefined,
    cardsPerMonth: plan.cards_per_month,
    features: plan.features,
    current,
    popular: plan.popular,
    ctaLabel: getPlanCtaLabel(plan, current),
    ctaVariant: current ? "current" : plan.popular ? "accent" : "outline",
  };
}

function mapAddon(addon: ApiBillingAddon): BillingAddon {
  return {
    id: addon.id,
    title: addon.title,
    description: addon.description,
    priceLabel: formatRub(addon.price),
  };
}

function getRenewalLabel(subscription: BillingSubscription) {
  if (subscription.cancels_at) {
    return `Доступен до ${formatDate(subscription.cancels_at)}`;
  }

  if (subscription.renews_at) {
    return `Обновляется ${formatDate(subscription.renews_at)}`;
  }

  return "Без автопродления";
}

function getMonthlyPriceLabel(price: number) {
  return price === 0 ? formatRub(price) : `${formatRub(price)}/мес`;
}

function getCardsPeriodLabel(cardsPerMonth: number) {
  if (cardsPerMonth <= 0) return "Без месячного лимита";
  return `${cardsPerMonth} ${getCardWord(cardsPerMonth)} в месяц`;
}

function getCardWord(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "карточка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "карточки";
  return "карточек";
}

function getPlanCtaLabel(plan: ApiBillingPlan, current: boolean) {
  if (current) return "Текущий план";
  return "Подключить";
}

function getYearlySavings(monthlyPrice: number, yearlyMonthlyPrice?: number) {
  if (!yearlyMonthlyPrice || monthlyPrice <= 0 || yearlyMonthlyPrice >= monthlyPrice) return undefined;
  return Math.round((1 - yearlyMonthlyPrice / monthlyPrice) * 100);
}

function formatRub(value: number) {
  return rubFormatter.format(value).replace(/\s?₽/, " ₽");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
