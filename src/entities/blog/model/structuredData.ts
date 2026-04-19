import { seoBlogImageUrl, seoPublisher } from "@/shared/config/seo";
import { buildCanonicalUrl } from "@/shared/seo";
import { blogPost, faqItems } from "./content";

export const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: blogPost.title,
  description: "Полный гайд по требованиям к фото для трёх крупнейших маркетплейсов России.",
  datePublished: blogPost.publishedAt,
  dateModified: blogPost.updatedAt,
  inLanguage: "ru",
  author: seoPublisher,
  publisher: seoPublisher,
  image: {
    "@type": "ImageObject",
    url: seoBlogImageUrl,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": buildCanonicalUrl(blogPost.canonicalPath),
  },
} as const;

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
} as const;

export const blogListingSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Блог kartochki.online",
  description: "Советы для продавцов на маркетплейсах: требования к фото, инфографика и оформление карточек.",
  url: buildCanonicalUrl("/blog"),
  inLanguage: "ru",
  publisher: seoPublisher,
} as const;
