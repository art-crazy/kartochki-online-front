import { siteConfig } from "./site";

export type MarketingLink = {
  label: string;
  href?: string;
};

export type NavLinkItem = {
  type: "link";
  label: string;
  href: string;
};

export type NavDropdownItem = {
  type: "dropdown";
  label: string;
  items: readonly (MarketingLink & { href: string })[];
};

export type NavItem = NavLinkItem | NavDropdownItem;

export type FooterColumn = {
  heading: string;
  links: readonly MarketingLink[];
};

export const marketplaceLinks = [
  { label: "Wildberries", href: "/marketplaces/wildberries" },
  { label: "Ozon", href: "/marketplaces/ozon" },
  { label: "Яндекс Маркет", href: "/marketplaces/yandex-market" },
] as const satisfies readonly MarketingLink[];

export const toolLinks = [
  { label: "Генератор карточек", href: "/tools/generator-kartochek" },
  { label: "Инфографика", href: "/tools/infografika" },
] as const satisfies readonly MarketingLink[];

export const marketingHeaderNav: readonly NavItem[] = [
  { type: "link", label: "Как работает", href: "/#how" },
  { type: "dropdown", label: "Площадки", items: marketplaceLinks },
  { type: "dropdown", label: "Инструменты", items: toolLinks },
  { type: "link", label: "Тарифы", href: "/#pricing" },
  { type: "link", label: "Блог", href: "/blog" },
];

export const blogHeaderNav: readonly NavItem[] = [
  { type: "link", label: "Главная", href: "/" },
  { type: "link", label: "Блог", href: "/blog" },
  { type: "link", label: "Тарифы", href: "/#pricing" },
];

export const marketingFooterColumns: readonly FooterColumn[] = [
  {
    heading: "Площадки",
    links: marketplaceLinks,
  },
  {
    heading: "Инструменты",
    links: toolLinks,
  },
  {
    heading: "Сервис",
    links: [
      { label: "Тарифы", href: "/#pricing" },
      { label: "Блог", href: "/blog" },
      { label: "Карта сайта", href: "/sitemap" },
      { label: "FAQ", href: "/#faq" },
      { label: "Поддержка", href: `mailto:${siteConfig.supportEmail}` },
    ],
  },
];

export const blogFooterColumns: readonly FooterColumn[] = [
  {
    heading: "Площадки",
    links: marketplaceLinks,
  },
  {
    heading: "Сервис",
    links: [
      { label: "Главная", href: "/" },
      { label: "Карта сайта", href: "/sitemap" },
      { label: "Тарифы", href: "/#pricing" },
      { label: "Поддержка", href: `mailto:${siteConfig.supportEmail}` },
    ],
  },
];

export const legalFooterColumns: readonly FooterColumn[] = [
  {
    heading: "Площадки",
    links: marketplaceLinks,
  },
  {
    heading: "Правовая информация",
    links: [
      { label: "Политика конфиденциальности" },
      { label: "Оферта" },
      { label: "Реквизиты", href: "/rekvizity" },
      { label: "Поддержка", href: `mailto:${siteConfig.supportEmail}` },
    ],
  },
];
