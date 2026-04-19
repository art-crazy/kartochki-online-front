import type { BlogPostDetail } from "@/shared/api";
import { seoBlogImageUrl, seoPublisher } from "@/shared/config/seo";
import { buildCanonicalUrl } from "@/shared/seo";

export function buildArticleSchema(post: BlogPostDetail) {
  const canonicalUrl = buildCanonicalUrl(post.canonical_path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
