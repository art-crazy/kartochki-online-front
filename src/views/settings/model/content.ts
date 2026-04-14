export type SettingsTabId = "profile" | "security" | "notifications" | "integrations" | "danger";

export const settingsTabs: ReadonlyArray<{ id: SettingsTabId; label: string; icon: string }> = [
  { id: "profile", label: "Профиль", icon: "◉" },
  { id: "security", label: "Безопасность", icon: "◎" },
  { id: "notifications", label: "Уведомления", icon: "◌" },
  { id: "integrations", label: "Интеграции", icon: "◈" },
  { id: "danger", label: "Действия", icon: "⚠" },
];

export type SettingsSessionData = {
  id: string;
  device: string;
  platform: string;
  location: string;
  isCurrent: boolean;
  canRevoke: boolean;
};

export const notificationLabels: Record<string, { title: string; description: string; group: "email" | "security" }> = {
  "email-ready": { title: "Генерация завершена", description: "Письмо, когда карточки готовы к скачиванию.", group: "email" },
  "email-limit": { title: "Лимит карточек заканчивается", description: "Уведомление при достижении 80% лимита тарифа.", group: "email" },
  "email-news": { title: "Новости продукта", description: "Обновления, новые функции и советы по работе.", group: "email" },
  "email-billing": { title: "Напоминание об оплате", description: "Письмо за 3 дня до окончания подписки или списания.", group: "email" },
  "email-marketing": { title: "Маркетинговые письма", description: "Акции, скидки и специальные предложения.", group: "email" },
  totp: { title: "2FA через приложение", description: "Google Authenticator, Яндекс Ключ и другие TOTP-приложения.", group: "security" },
  sms: { title: "SMS-подтверждение", description: "Код на номер телефона при каждом входе.", group: "security" },
};

export const deleteConfirmWord = "УДАЛИТЬ";
