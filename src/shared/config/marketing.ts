export type MarketingLink = {
  label: string;
  href?: string;
};

export const marketingHeaderLinks = [
  { label: "Как работает", href: "/#how" },
  { label: "Площадки", href: "/#platforms" },
  { label: "Возможности", href: "/#features" },
  { label: "Тарифы", href: "/#pricing" },
  { label: "Блог", href: "/blog" },
] as const satisfies readonly MarketingLink[];

export const blogHeaderLinks = [
  { label: "Главная", href: "/" },
  { label: "Блог", href: "/blog" },
  { label: "Тарифы", href: "/#pricing" },
] as const satisfies readonly MarketingLink[];

export const marketingFooterLinks = [
  { label: "FAQ", href: "/#faq" },
  { label: "Тарифы", href: "/#pricing" },
  { label: "Блог", href: "/blog" },
  { label: "Поддержка", href: "mailto:support@kartochki-online.ru" },
] as const satisfies readonly MarketingLink[];

export const blogFooterLinks = [
  { label: "Главная", href: "/" },
  { label: "Тарифы", href: "/#pricing" },
  { label: "Поддержка", href: "mailto:support@kartochki-online.ru" },
] as const satisfies readonly MarketingLink[];

export const legalFooterLinks = [
  { label: "Политика конфиденциальности" },
  { label: "Оферта" },
  { label: "Поддержка", href: "mailto:support@kartochki-online.ru" },
] as const satisfies readonly MarketingLink[];
