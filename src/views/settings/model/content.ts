export type SettingsTabId = "profile" | "security" | "notifications" | "integrations" | "danger";

export const settingsTabs: ReadonlyArray<{
  id: SettingsTabId;
  label: string;
  icon: string;
}> = [
  { id: "profile", label: "Профиль", icon: "◉" },
  { id: "security", label: "Безопасность", icon: "◎" },
  { id: "notifications", label: "Уведомления", icon: "◌" },
  { id: "integrations", label: "Интеграции", icon: "◈" },
  { id: "danger", label: "Действия", icon: "⚠" },
];

export const profileData = {
  initials: "ИИ",
  name: "Иван Иванов",
  email: "ivan@kartochki.online",
  phone: "+7 (999) 123-45-67",
  company: "ИП Иванов",
};

export const profileDefaults = {
  marketplace: "wildberries",
  cardsPerGeneration: "10",
  format: "png",
};

export const securitySessions = [
  {
    id: "current",
    icon: "💻",
    name: "MacBook Pro · Chrome",
    status: "Текущая сессия · Москва",
    tone: "success" as const,
    actionLabel: null,
  },
  {
    id: "iphone",
    icon: "📱",
    name: "iPhone 15 · Safari",
    status: "2 дня назад · Москва",
    tone: "muted" as const,
    actionLabel: "Завершить",
  },
];

export const notificationItems = {
  email: [
    {
      key: "email-ready",
      title: "Генерация завершена",
      description: "Письмо, когда карточки готовы к скачиванию.",
      defaultChecked: true,
    },
    {
      key: "email-limit",
      title: "Лимит карточек заканчивается",
      description: "Уведомление при достижении 80% лимита тарифа.",
      defaultChecked: true,
    },
    {
      key: "email-news",
      title: "Новости продукта",
      description: "Обновления, новые функции и советы по работе.",
      defaultChecked: false,
    },
    {
      key: "email-billing",
      title: "Напоминание об оплате",
      description: "Письмо за 3 дня до окончания подписки или списания.",
      defaultChecked: true,
    },
    {
      key: "email-marketing",
      title: "Маркетинговые письма",
      description: "Акции, скидки и специальные предложения.",
      defaultChecked: false,
    },
  ],
  security: [
    {
      key: "totp",
      title: "2FA через приложение",
      description: "Google Authenticator, Яндекс Ключ и другие TOTP-приложения.",
      defaultChecked: false,
    },
    {
      key: "sms",
      title: "SMS-подтверждение",
      description: "Код на номер телефона при каждом входе.",
      defaultChecked: false,
    },
  ],
};

export const connectedAccounts = [
  {
    id: "google",
    name: "Google",
    status: "Подключён · ivan@kartochki.online",
    connected: true,
    actionLabel: "Отключить",
  },
  {
    id: "telegram",
    name: "Telegram",
    status: "Не подключён",
    connected: false,
    actionLabel: "Подключить",
  },
];

export const apiKeyMask = "sk-kartochki-xxxxxxxxxxxxxxxxxxxx";

export const deleteConfirmWord = "УДАЛИТЬ";
