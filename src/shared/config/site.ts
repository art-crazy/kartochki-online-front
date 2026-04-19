export const siteConfig = {
  name: "карточки.онлайн",
  applicationName: "kartochki.online",
  locale: "ru-RU",
  openGraphLocale: "ru_RU",
  description:
    "Сервис для создания карточек товаров, инфографики и изображений для продавцов на маркетплейсах.",
  keywords: [
    "карточки товаров",
    "карточки для маркетплейсов",
    "генерация карточек товаров",
    "изображения для маркетплейсов",
    "SEO для маркетплейсов",
  ],
  domains: ["kartochki-online.ru"],
  defaultUrl: "https://kartochki-online.ru",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://kartochki-online.ru",
  supportEmail: "support@kartochki-online.ru",
};

export function buildSiteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, siteConfig.defaultUrl).toString();
}
