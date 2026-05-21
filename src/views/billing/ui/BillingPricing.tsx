"use client";

import { useCallback, useEffect, useState } from "react";
import { classNames } from "@/shared/lib/classNames";
import { Accordion, Badge, Button, CardSurface } from "@/shared/ui";
import { billingFaqItems, type BillingAddon, type BillingPlan } from "@/views/billing/model/content";
import type { BillingCheckoutTarget } from "@/views/billing/model/checkout";
import { BillingCheckoutModal } from "./BillingCheckoutModal";
import styles from "./BillingPage.module.scss";

type BillingPricingProps = {
  addons: ReadonlyArray<BillingAddon>;
  checkoutRequirements: {
    emailRequired: boolean;
  };
  plans: ReadonlyArray<BillingPlan>;
};

type ToastState = {
  message: string;
};

export function BillingPricing({ addons, checkoutRequirements, plans }: BillingPricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<BillingCheckoutTarget | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeCheckoutModal = useCallback(() => setCheckoutTarget(null), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function openPlanModal(planId: BillingPlan["id"]) {
    const plan = plans.find((item) => item.id === planId);
    if (!plan || plan.current) return;
    const period = getCheckoutPeriod(plan, isYearly);
    setCheckoutTarget({
      type: "plan",
      plan,
      period,
      periodLabel: period === "yearly" ? "1 год" : "1 месяц",
      totalLabel: getCheckoutLabel(plan, isYearly),
    });
  }

  return (
    <>
      <section className={styles.periodToggle} aria-label="Период оплаты">
        <span className={classNames(styles.periodLabel, !isYearly && styles.periodLabelActive)}>Помесячно</span>
        <button
          type="button"
          aria-pressed={isYearly}
          aria-label="Переключить на годовую оплату"
          className={classNames(styles.toggleSwitch, isYearly && styles.toggleSwitchOn)}
          onClick={() => setIsYearly((current) => !current)}
        >
          <span className={styles.toggleKnob} />
        </button>
        <span className={classNames(styles.periodLabel, isYearly && styles.periodLabelActive)}>Годовая подписка</span>
        <span aria-hidden={!isYearly} className={classNames(styles.periodBadgeSlot, isYearly && styles.periodBadgeSlotVisible)}>
          <Badge tone="success">-20%</Badge>
        </span>
      </section>

      <section className={styles.plansGrid} aria-label="Тарифные планы">
        {plans.map((plan) => {
          const price = getPlanPrice(plan, isYearly);
          const period = getPlanPeriod(plan, isYearly);
          const checkoutLabel = getCheckoutLabel(plan, isYearly);

          return (
            <CardSurface
              key={plan.id}
              theme="dark"
              className={classNames(styles.planCard, plan.current && styles.planCardCurrent, plan.popular && styles.planCardPopular)}
            >
              {plan.popular ? <div className={styles.popularTag}>Популярный</div> : null}
              {plan.current ? (
                <div className={styles.currentTag}>
                  <span className={styles.currentDot} />
                  Текущий план
                </div>
              ) : null}

              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPriceRow}>
                <div className={styles.planPrice}>{price.current}</div>
                {price.old ? <div className={styles.planPriceOld}>{price.old}</div> : null}
              </div>
              <div className={styles.planPeriod}>{period}</div>
              <div className={styles.planDivider} />

              <ul className={styles.planFeatures}>
                {plan.features.map((feature) => (
                  <li key={feature.label} className={styles.planFeature}>
                    <span className={feature.enabled ? styles.featureYes : styles.featureNo}>{feature.enabled ? "✓" : "×"}</span>
                    <span className={!feature.enabled ? styles.featureMuted : undefined}>{feature.label}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant === "accent" ? "darkPrimary" : "darkOutline"}
                className={classNames(styles.planButton, plan.ctaVariant === "current" && styles.planButtonCurrent, plan.ctaVariant === "outline" && styles.planButtonOutline)}
                aria-haspopup={plan.current ? undefined : "dialog"}
                disabled={plan.current}
                onClick={() => openPlanModal(plan.id)}
              >
                {plan.current ? plan.ctaLabel : `${plan.ctaLabel} ->`}
              </Button>

              <span className={styles.planCheckoutHint}>Оплата: {checkoutLabel}</span>
            </CardSurface>
          );
        })}
      </section>

      {addons.length > 0 ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Разовые пакеты</h2>
            <p className={styles.sectionSubtitle}>Докупить карточки можно без смены тарифа.</p>
          </div>
          <div className={styles.addonsGrid}>
            {addons.map((addon) => (
              <button
                key={addon.id}
                type="button"
                className={styles.addonCard}
                onClick={() => setCheckoutTarget({ type: "addon", addon, totalLabel: addon.priceLabel })}
              >
                <span className={styles.addonIcon} aria-hidden="true">+</span>
                <span className={styles.addonBody}>
                  <span className={styles.addonTitle}>{addon.title}</span>
                  <span className={styles.addonDescription}>{addon.description}</span>
                </span>
                <span className={styles.addonPrice}>{addon.priceLabel}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Частые вопросы</h2>
        </div>
        <Accordion items={billingFaqItems} theme="dark" />
      </section>

      {checkoutTarget ? (
        <BillingCheckoutModal
          target={checkoutTarget}
          emailRequired={checkoutRequirements.emailRequired}
          onClose={closeCheckoutModal}
          onFallbackError={(message) => setToast({ message })}
        />
      ) : null}

      {toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={styles.toastDot} />
          <span>{toast.message}</span>
        </div>
      ) : null}
    </>
  );
}

function getPlanPrice(plan: BillingPlan, isYearly: boolean) {
  if (!isYearly || !plan.yearlyMonthlyPrice) return { current: plan.monthlyPriceLabel, old: undefined };
  return { current: `${plan.yearlyMonthlyPrice} ₽/мес`, old: `${plan.monthlyPrice} ₽/мес` };
}

function getPlanPeriod(plan: BillingPlan, isYearly: boolean) {
  if (!isYearly || !plan.yearlyPeriodLabel) return plan.monthlyPeriodLabel;
  return plan.yearlySavingsLabel ? `${plan.yearlyPeriodLabel} · ${plan.yearlySavingsLabel}` : plan.yearlyPeriodLabel;
}

function getCheckoutLabel(plan: BillingPlan, isYearly: boolean) {
  if (!isYearly || !plan.yearlyCheckoutLabel) return plan.monthlyCheckoutLabel;
  return plan.yearlyCheckoutLabel;
}

function getCheckoutPeriod(plan: BillingPlan, isYearly: boolean): "monthly" | "yearly" {
  return isYearly && plan.yearlyCheckoutLabel ? "yearly" : "monthly";
}
