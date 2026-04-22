"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createBillingCheckoutMutation,
  type ErrorResponse,
} from "@/shared/api";
import { classNames } from "@/shared/lib/classNames";
import { Accordion, Badge, Button, CardSurface } from "@/shared/ui";
import { billingFaqItems, type BillingPlan } from "@/views/billing/model/content";
import styles from "./BillingPage.module.scss";

type BillingPricingProps = {
  plans: ReadonlyArray<BillingPlan>;
};

type ToastState = {
  message: string;
};

export function BillingPricing({ plans }: BillingPricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const checkoutMutation = useMutation({
    ...createBillingCheckoutMutation(),
    onSuccess: ({ checkout_url }) => window.location.assign(checkout_url),
    onError: (error: ErrorResponse) => setToast({ message: error.message ?? "Не удалось открыть оплату" }),
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!selectedPlan) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedPlan(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlan]);

  function openPlanModal(planId: BillingPlan["id"]) {
    const plan = plans.find((item) => item.id === planId);
    if (!plan || plan.current) return;
    setSelectedPlan(plan);
  }

  function handlePurchase() {
    if (!selectedPlan) return;
    checkoutMutation.mutate({ body: { plan_id: selectedPlan.id, period: isYearly ? "yearly" : "monthly" } });
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

      {/* TODO: вернуть секцию дополнительных пакетов после повторного согласования отображения на /app/billing */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Частые вопросы</h2>
        </div>
        <Accordion items={billingFaqItems} theme="dark" />
      </section>

      {selectedPlan ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setSelectedPlan(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="billing-checkout-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="billing-checkout-title" className={styles.modalTitle}>{selectedPlan.ctaLabel}</h2>
            <p className={styles.modalText}>Проверьте условия перед переходом к оплате.</p>

            <div className={styles.modalRows}>
              <ModalRow label="Тариф" value={selectedPlan.name} />
              <ModalRow label="Период" value={isYearly ? "1 год" : "1 месяц"} />
              <ModalRow label="Карточек в месяц" value={String(selectedPlan.cardsPerMonth)} />
            </div>

            <div className={styles.modalTotal}>
              <span className={styles.modalTotalLabel}>Итого</span>
              <span className={styles.modalTotalPrice}>{getCheckoutLabel(selectedPlan, isYearly)}</span>
            </div>

            <div className={styles.modalActions}>
              <Button variant="darkOutline" block onClick={() => setSelectedPlan(null)}>Отмена</Button>
              <Button variant="darkPrimary" block disabled={checkoutMutation.isPending} onClick={handlePurchase}>
                {checkoutMutation.isPending ? "Открываем оплату..." : "Оплатить ->"}
              </Button>
            </div>
          </div>
        </div>
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

function ModalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.modalRow}>
      <span className={styles.modalRowLabel}>{label}</span>
      <span className={styles.modalRowValue}>{value}</span>
    </div>
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
