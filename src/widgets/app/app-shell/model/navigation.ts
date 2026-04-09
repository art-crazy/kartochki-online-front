export type AppShellNavItem = {
  key: string;
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

export const primaryNavItems: ReadonlyArray<AppShellNavItem> = [
  { key: "dashboard", href: "/app", label: "Дашборд", icon: "⊞" },
  { key: "generate", href: "/app/generate", label: "Генерация", icon: "⚡", badge: "Новое" },
  { key: "projects", href: "/app", label: "Проекты", icon: "◫" },
];

export const accountNavItems: ReadonlyArray<AppShellNavItem> = [
  { key: "billing", href: "/app/billing", label: "Тарифы", icon: "◈" },
  { key: "settings", href: "/app/settings", label: "Настройки", icon: "◎" },
];

export const mobileNavItems: ReadonlyArray<AppShellNavItem> = [
  { key: "dashboard", href: "/app", label: "Главная", icon: "⊞" },
  { key: "generate", href: "/app/generate", label: "Создать", icon: "⚡" },
  { key: "projects", href: "/app", label: "Проекты", icon: "◫" },
  { key: "billing", href: "/app/billing", label: "Тарифы", icon: "◈" },
  { key: "settings", href: "/app/settings", label: "Профиль", icon: "◎" },
];
