import { cache } from "react";
import type { Metadata } from "next";
import { blogPostSlugs, getBlogPostBySlug } from "@/entities/blog/model/content";
import { getPublicBlogPostBySlug } from "@/shared/api";
import { buildArticleMetadata, buildIndexRobots } from "@/shared/seo";

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

    return buildArticleMetadata({
      title: post.title,
      description: post.description,
      keywords: post.tags.map((tag) => tag.label),
      path: post.canonical_path,
      robots: buildIndexRobots(),
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    });
  }

  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata({
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    path: post.canonicalPath,
    robots: buildIndexRobots(),
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}
