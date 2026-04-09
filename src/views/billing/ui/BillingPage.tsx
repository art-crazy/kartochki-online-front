import { ProgressBar } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { currentSubscription } from "@/views/billing/model/content";
import { BillingPricing } from "./BillingPricing";
import styles from "./BillingPage.module.scss";

export function BillingPage() {
  return (
    <AppShell title="Тарифы и оплата" subtitle="Управление подпиской, лимитами и пакетами карточек" activeKey="billing">
      <main className={styles.page}>
        <section className={styles.banner}>
          <div className={styles.bannerIcon} aria-hidden="true">
            ₽
          </div>

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
            <ProgressBar
              dark
              label="Использование лимита"
              value={currentSubscription.usage.value}
              max={currentSubscription.usage.max}
              valueLabel={`${currentSubscription.usage.value} из ${currentSubscription.usage.max}`}
            />
          </div>
        </section>

        <BillingPricing />
      </main>
    </AppShell>
  );
}
