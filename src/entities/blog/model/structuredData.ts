import type { BlogPostEntry } from "./content";
import { seoBlogImageUrl, seoPublisher } from "@/shared/config/seo";
import { buildCanonicalUrl } from "@/shared/seo";

export function buildMarkdownArticleSchema(post: BlogPostEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "ru",
    author: seoPublisher,
    publisher: seoPublisher,
    image: {
      "@type": "ImageObject",
      url: seoBlogImageUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonicalUrl(post.canonicalPath),
    },
  } as const;
}

export const blogListingSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Блог kartochki.online",
  description: "Советы для продавцов на маркетплейсах: требования к фото, инфографика и оформление карточек.",
  url: buildCanonicalUrl("/blog"),
  inLanguage: "ru",
  publisher: seoPublisher,
} as const;
