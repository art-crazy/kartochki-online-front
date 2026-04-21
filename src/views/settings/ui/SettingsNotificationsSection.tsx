"use client";

import { Button } from "@/shared/ui";
import { notificationLabels } from "@/views/settings/model/content";
import { useSettingsPage } from "@/views/settings/model/useSettingsPage";
import { SettingsCard, SwitchRow } from "./SettingsPageParts";
import styles from "./SettingsPage.module.scss";

type SettingsPageModel = ReturnType<typeof useSettingsPage>;

type SettingsNotificationsSectionProps = {
  active: boolean;
  page: SettingsPageModel;
  profileEmail: string;
};

export function SettingsNotificationsSection({
  active,
  page,
  profileEmail,
}: SettingsNotificationsSectionProps) {
  const emailNotifications = Object.entries(notificationLabels).filter(([, value]) => value.group === "email");

  return (
    <section
      id="settings-panel-notifications"
      role="tabpanel"
      aria-labelledby="settings-tab-notifications"
      hidden={!active}
      className={active ? styles.panelActive : styles.panelHidden}
    >
      {/* TODO: вынести email и Telegram уведомления в отдельные feature-слайсы, когда появится полноценное управление каналами и подписками. */}
      <SettingsCard title="Email-уведомления" subtitle={`На адрес ${profileEmail}.`}>
        <div className={styles.stack}>
          {emailNotifications.map(([key, meta]) => (
            <SwitchRow
              key={key}
              checked={page.notifications[key] ?? false}
              title={meta.title}
              description={meta.description}
              disabled={page.notificationsMutation.isPending}
              onToggle={() => page.toggleNotification(key)}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Telegram-уведомления" subtitle="Мгновенные оповещения в мессенджере.">
        <div className={styles.listRow}>
          <div className={styles.listBody}>
            <div className={styles.listTitle}>Подключить Telegram-бота</div>
            <div className={styles.listMetaMuted}>Уведомления о готовых карточках и событиях аккаунта.</div>
          </div>
          <Button variant="darkOutline" size="sm" onClick={() => page.showToast("Открываем Telegram-бота...")}>
            Подключить
          </Button>
        </div>
      </SettingsCard>
    </section>
  );
}
