import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPostSlugs, getBlogPostBySlug } from "@/entities/blog/model/content";
import { siteConfig } from "@/shared/config/site";
import { BlogPostPage } from "@/views/blog-post/ui/BlogPostPage";

type BlogPostRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
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

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage />;
}
