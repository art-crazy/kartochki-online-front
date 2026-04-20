import { type SettingsResponse } from "@/shared/api";
import { notificationLabels } from "@/views/settings/model/content";
import { SettingsCard, SwitchRow } from "./SettingsPageParts";
import styles from "./SettingsPage.module.scss";

type SettingsTwoFactorCardProps = {
  notifications: Record<string, boolean>;
  notificationsPending: boolean;
  onToggle: (key: string) => void;
  settings: SettingsResponse;
};

export function SettingsTwoFactorCard({
  notifications,
  notificationsPending,
  onToggle,
  settings,
}: SettingsTwoFactorCardProps) {
  const securityNotifications = Object.entries(notificationLabels).filter(([, value]) => value.group === "security");

  return (
    <SettingsCard title="Двухфакторная аутентификация" subtitle="Дополнительная защита аккаунта при входе.">
      {/* TODO: вернуть блок в /app/settings, когда появится отдельный 2FA flow, а не переиспользование notification toggles. */}
      <div className={styles.stack} data-settings-owner={settings.profile.email ?? settings.profile.name}>
        {securityNotifications.map(([key, meta]) => (
          <SwitchRow
            key={key}
            checked={notifications[key] ?? false}
            title={meta.title}
            description={meta.description}
            disabled={notificationsPending}
            onToggle={() => onToggle(key)}
          />
        ))}
      </div>
    </SettingsCard>
  );
}
