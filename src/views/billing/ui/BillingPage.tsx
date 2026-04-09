import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { currentSubscription } from "@/views/billing/model/content";
import { BillingPricing } from "./BillingPricing";
import styles from "./BillingPage.module.scss";

export function BillingPage() {
  const usagePercent = (currentSubscription.usage.value / currentSubscription.usage.max) * 100;

  return (
    <AppShell
      title="Тарифы и оплата"
      subtitle="Управление подпиской, лимитами и пакетами карточек"
      activeKey="billing"
    >
      <main className={styles.page}>
        <section className={styles.banner}>
          <div className={styles.bannerIcon} aria-hidden="true">
            ◈
          </div>

          <div className={styles.bannerInfo}>
            <h1 className={styles.bannerTitle}>Бесплатный план</h1>
            <p className={styles.bannerSubtitle}>Обновляется 1 мая 2025 · Платёжных данных нет</p>
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

        <BillingPricing />
      </main>
    </AppShell>
  );
}
