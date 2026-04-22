import { buildSiteUrl, siteConfig } from "@/shared/config/site";
import { seoPublisher } from "@/shared/config/seo";
import { faqItems } from "@/widgets/marketing/home/model/content";
import { homePricingOffers } from "@/widgets/marketing/home/model/pricing";

export const organizationSchema = {
  "@context": "https://schema.org",
  ...seoPublisher,
  alternateName: "карточки.онлайн",
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.supportEmail,
    contactType: "customer support",
    availableLanguage: "Russian",
  },
  sameAs: [],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "kartochki.online",
  url: buildSiteUrl("/"),
  inLanguage: "ru",
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.applicationName,
  description:
    "Генератор карточек товаров для Wildberries, Ozon и Яндекс Маркета с автоматической инфографикой, обработкой фото и SEO-текстами.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ru",
  url: buildSiteUrl("/"),
  offers: homePricingOffers,
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.content,
    },
  })),
};
