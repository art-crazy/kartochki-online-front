"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBillingOptions } from "@/shared/api";
import { Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { mapBillingResponse } from "@/views/billing/model/mappers";
import { BillingPricing } from "./BillingPricing";
import styles from "./BillingPage.module.scss";

export function BillingPage() {
  const {
    data: pageContent,
    isError,
    isPending,
    refetch,
  } = useQuery({
    ...getBillingOptions(),
    select: mapBillingResponse,
  });

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
    >
      <main className={styles.page}>
        <section className={styles.banner}>
          <div className={styles.bannerIcon} aria-hidden="true">◆</div>

          <div className={styles.bannerInfo}>
            <h1 className={styles.bannerTitle}>{currentSubscription.planName}</h1>
            <p className={styles.bannerSubtitle}>
              {currentSubscription.renewalLabel} · {currentSubscription.paymentLabel}
            </p>
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

        <BillingPricing addons={pageContent.addons} plans={pageContent.plans} />
      </main>
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
