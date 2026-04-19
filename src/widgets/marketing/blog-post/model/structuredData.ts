import type { BlogPostDetail } from "@/shared/api";
import { siteConfig } from "@/shared/config/site";
import { seoBlogImageUrl, seoPublisher } from "@/shared/config/seo";

export function buildArticleSchema(post: BlogPostDetail) {
  const canonicalUrl = `${siteConfig.defaultUrl}${post.canonical_path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: "ru",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: seoPublisher,
    publisher: seoPublisher,
    image: {
      "@type": "ImageObject",
      url: seoBlogImageUrl,
    },
  };
}
