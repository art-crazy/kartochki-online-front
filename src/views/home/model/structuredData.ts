import { siteConfig } from "@/shared/config/site";
import { seoPublisher } from "@/shared/config/seo";
import { faqItems } from "@/widgets/marketing/home/model/content";

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
  url: siteConfig.defaultUrl,
  inLanguage: "ru",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.defaultUrl}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.applicationName,
  description:
    "ИИ-генератор карточек товаров для Wildberries, Ozon и Яндекс Маркет с автоматической инфографикой, фонами и SEO-текстами.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ru",
  url: siteConfig.defaultUrl,
  offers: [
    { "@type": "Offer", name: "Старт", price: "0", priceCurrency: "RUB" },
    { "@type": "Offer", name: "Про", price: "490", priceCurrency: "RUB" },
    { "@type": "Offer", name: "Бизнес", price: "990", priceCurrency: "RUB" },
  ],
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
