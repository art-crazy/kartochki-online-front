"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBillingSubscriptionMutation,
  deleteBillingPaymentMethodMutation,
  getBillingOptions,
  getBillingQueryKey,
  type ErrorResponse,
} from "@/shared/api";
import { Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { mapBillingResponse } from "@/views/billing/model/mappers";
import { BillingPricing } from "./BillingPricing";
import styles from "./BillingPage.module.scss";

export function BillingPage() {
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const checkoutPollingUntilRef = useRef(0);
  const [expectedCheckoutPlan] = useState(() => getCheckoutReturnPlan());
  const {
    data: pageContent,
    isError,
    isPending,
    refetch,
  } = useQuery({
    ...getBillingOptions(),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    select: mapBillingResponse,
  });
  const cancelMutation = useMutation({
    ...cancelBillingSubscriptionMutation(),
    onSuccess: () => {
      setCancelModalOpen(false);
      setToast("Автопродление отключено");
      void queryClient.invalidateQueries({ queryKey: getBillingQueryKey() });
    },
    onError: (error: ErrorResponse) => setToast(error.message ?? "Не удалось отменить подписку"),
  });
  const deleteCardMutation = useMutation({
    ...deleteBillingPaymentMethodMutation(),
    onSuccess: () => {
      setDeleteCardModalOpen(false);
      setToast("Карта удалена");
      void queryClient.invalidateQueries({ queryKey: getBillingQueryKey() });
    },
    onError: (error: ErrorResponse) => setToast(error.message ?? "Не удалось удалить карту"),
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!expectedCheckoutPlan) return;
    checkoutPollingUntilRef.current = Date.now() + 45_000;
    void refetch();
  }, [expectedCheckoutPlan, refetch]);

  useEffect(() => {
    if (!expectedCheckoutPlan || !pageContent || pageContent.currentSubscription.planId === expectedCheckoutPlan) return undefined;
    if (checkoutPollingUntilRef.current <= Date.now()) return undefined;

    const timer = window.setInterval(() => {
      void refetch();
      if (Date.now() >= checkoutPollingUntilRef.current) {
        window.clearInterval(timer);
      }
    }, 2000);

    return () => window.clearInterval(timer);
  }, [expectedCheckoutPlan, pageContent, refetch]);

  useEffect(() => {
    if (!cancelModalOpen && !deleteCardModalOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (cancelModalOpen && !cancelMutation.isPending) setCancelModalOpen(false);
        if (deleteCardModalOpen && !deleteCardMutation.isPending) setDeleteCardModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelModalOpen, cancelMutation.isPending, deleteCardModalOpen, deleteCardMutation.isPending]);

  function closeCancelModal() {
    if (!cancelMutation.isPending) {
      setCancelModalOpen(false);
    }
  }

  function closeDeleteCardModal() {
    if (!deleteCardMutation.isPending) {
      setDeleteCardModalOpen(false);
    }
  }

  if (isPending) {
    return (
      <AppShell title="Тарифы и оплата" subtitle="Загружаем данные подписки" activeKey="billing">
        <main className={styles.page}>
          <BillingStateCard title="Загружаем тарифы" description="Проверяем текущий план, лимиты и доступные пакеты." />
        </main>
      </AppShell>
    );
  }

  if (isError || !pageContent) {
    return (
      <AppShell title="Тарифы и оплата" subtitle="Не удалось получить данные подписки" activeKey="billing">
        <main className={styles.page}>
          <BillingStateCard
            title="Не удалось загрузить billing"
            description="Проверьте подключение к API и повторите запрос."
            action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
          />
        </main>
      </AppShell>
    );
  }

  const { currentSubscription } = pageContent;
  const usagePercent = currentSubscription.usage.max > 0
    ? (currentSubscription.usage.value / currentSubscription.usage.max) * 100
    : 0;

  return (
    <AppShell
      title="Тарифы и оплата"
      subtitle="Управление подпиской, лимитами и пакетами карточек"
      activeKey="billing"
      sidebarPlan={currentSubscription.planId === "free" ? {
        actionLabel: "Выбрать тариф →",
        href: "/app/billing",
        label: "Бесплатный план",
        progress: currentSubscription.usage.max > 0 ? (currentSubscription.usage.value / currentSubscription.usage.max) * 100 : 0,
        usage: `${currentSubscription.usage.value} / ${currentSubscription.usage.max}`,
      } : null}
    >
      <main className={styles.page}>
        <section className={styles.banner}>
          <div className={styles.bannerIcon} aria-hidden="true">◆</div>

          <div className={styles.bannerInfo}>
            <h1 className={styles.bannerTitle}>{currentSubscription.planName}</h1>
            <p className={styles.bannerSubtitle}>{currentSubscription.renewalLabel}</p>
            {currentSubscription.savedCard ? (
              <div className={styles.bannerCard}>
                <span className={styles.bannerCardIcon} aria-hidden="true">▣</span>
                <span className={styles.bannerCardNumber}>
                  {currentSubscription.savedCard.cardType} •••• {currentSubscription.savedCard.last4}
                </span>
                <span className={styles.bannerCardExpiry}>
                  до {currentSubscription.savedCard.expiryMonth}/{currentSubscription.savedCard.expiryYear.slice(-2)}
                </span>
                <button
                  type="button"
                  className={styles.bannerCardRemove}
                  onClick={() => setDeleteCardModalOpen(true)}
                >
                  Удалить карту
                </button>
              </div>
            ) : null}
            {currentSubscription.canCancel ? (
              <div className={styles.bannerActions}>
                <Button variant="darkOutline" size="sm" onClick={() => setCancelModalOpen(true)}>
                  Отключить автопродление
                </Button>
              </div>
            ) : null}
          </div>

          <div className={styles.bannerUsage}>
            <div className={styles.bannerUsageValue}>
              {currentSubscription.usage.value}
              <span> / {currentSubscription.usage.max}</span>
            </div>
            <div className={styles.bannerUsageLabel}>карточек использовано</div>
            <div
              className={styles.bannerUsageBar}
              role="progressbar"
              aria-label="Использование лимита"
              aria-valuemin={0}
              aria-valuemax={currentSubscription.usage.max}
              aria-valuenow={currentSubscription.usage.value}
            >
              <div className={styles.bannerUsageFill} style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
        </section>

        <BillingPricing
          addons={pageContent.addons}
          checkoutRequirements={pageContent.checkoutRequirements}
          plans={pageContent.plans}
        />
      </main>

      {deleteCardModalOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={closeDeleteCardModal}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="billing-delete-card-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="billing-delete-card-title" className={styles.modalTitle}>Удалить привязанную карту?</h2>
            <p className={styles.modalText}>Автопродление подписки будет отключено. Оплаченный доступ сохранится до конца текущего периода.</p>
            <div className={styles.modalActions}>
              <Button variant="darkOutline" block disabled={deleteCardMutation.isPending} onClick={closeDeleteCardModal}>Отмена</Button>
              <Button variant="danger" block disabled={deleteCardMutation.isPending} onClick={() => deleteCardMutation.mutate({})}>
                {deleteCardMutation.isPending ? "Удаляем..." : "Удалить карту"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {cancelModalOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={closeCancelModal}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="billing-cancel-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="billing-cancel-title" className={styles.modalTitle}>Отключить автопродление?</h2>
            <p className={styles.modalText}>Оплаченный доступ сохранится до конца текущего периода.</p>
            <div className={styles.modalActions}>
              <Button variant="darkOutline" block disabled={cancelMutation.isPending} onClick={closeCancelModal}>Оставить</Button>
              <Button variant="danger" block disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate({})}>
                {cancelMutation.isPending ? "Отключаем..." : "Отключить"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={styles.toastDot} />
          <span>{toast}</span>
        </div>
      ) : null}
    </AppShell>
  );
}

function BillingStateCard({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.stateCard}>
      <h2 className={styles.stateTitle}>{title}</h2>
      <p className={styles.stateText}>{description}</p>
      {action ? <div className={styles.stateAction}>{action}</div> : null}
    </CardSurface>
  );
}

function getCheckoutReturnPlan() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("billing_checkout");
}
