import { cache } from "react";
import type { Metadata } from "next";
import { blogPostSlugs, getBlogPostBySlug } from "@/entities/blog/model/content";
import { getPublicBlogPostBySlug } from "@/shared/api";
import { siteConfig } from "@/shared/config/site";

export const getApiBlogPost = cache(async (slug: string) => {
  try {
    const { data } = await getPublicBlogPostBySlug({
      path: {
        slug,
      },
      throwOnError: true,
    });

    return data;
  } catch {
    return null;
  }
});

export function getStaticBlogPostParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export function hasFallbackBlogPost(slug: string) {
  return getBlogPostBySlug(slug) !== null;
}

export async function getBlogPostMetadata(slug: string): Promise<Metadata> {
  const apiPost = await getApiBlogPost(slug);

  if (apiPost) {
    const { post } = apiPost;
    const canonical = `${siteConfig.defaultUrl}${post.canonical_path}`;

    return {
      title: post.title,
      description: post.description,
      keywords: post.tags.map((tag) => tag.label),
      alternates: {
        canonical,
      },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        url: canonical,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  const canonical = `${siteConfig.defaultUrl}${post.canonicalPath}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
