import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site";
import { getBlogPageContent, getBlogPageNumber } from "@/views/blog/model/server";
import { BlogPage } from "@/views/blog/ui/BlogPage";

type BlogRouteProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export const revalidate = 86_400;

export async function generateMetadata({ searchParams }: BlogRouteProps): Promise<Metadata> {
  const page = getBlogPageNumber((await searchParams)?.page);
  const canonicalPath = page > 1 ? `/blog?page=${page}` : "/blog";

  return {
    title: page > 1 ? `Блог, страница ${page}` : "Блог",
    description:
      "Советы и инструкции для продавцов Wildberries, Ozon и Яндекс Маркета: требования к фото, инфографика, оформление карточек и рост конверсии.",
    alternates: {
      canonical: `${siteConfig.defaultUrl}${canonicalPath}`,
    },
    openGraph: {
      title: "Блог kartochki.online",
      description:
        "Практические статьи для продавцов на Wildberries, Ozon и Яндекс Маркете: фото, инфографика и оформление карточек.",
      url: `${siteConfig.defaultUrl}${canonicalPath}`,
    },
  };
}

export default async function BlogRoute({ searchParams }: BlogRouteProps) {
  const page = getBlogPageNumber((await searchParams)?.page);
  const content = await getBlogPageContent(page);

  return <BlogPage content={content} />;
}
