import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARKETING_PAGE_REVALIDATE } from "@/shared/seo";
import { getApiBlogPost, getBlogPostMetadata, getStaticBlogPostParams, hasFallbackBlogPost } from "@/views/blog-post/model/server";
import { ApiBlogPostPage } from "@/views/blog-post/ui/ApiBlogPostPage";
import { BlogPostPage } from "@/views/blog-post/ui/BlogPostPage";

type BlogPostRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = true;
export const revalidate = MARKETING_PAGE_REVALIDATE;

export function generateStaticParams() {
  return getStaticBlogPostParams();
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  return getBlogPostMetadata(slug);
}

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const apiPost = await getApiBlogPost(slug);

  if (apiPost) {
    return <ApiBlogPostPage content={apiPost} />;
  }

  if (!hasFallbackBlogPost(slug)) {
    notFound();
  }

  return <BlogPostPage slug={slug} />;
}
