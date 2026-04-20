import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
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

  return buildPageMetadata({
    title: page > 1 ? `Блог, страница ${page}` : "Блог",
    description:
      "Советы и инструкции для продавцов Wildberries, Ozon и Яндекс Маркета: требования к фото, инфографика, оформление карточек и рост конверсии.",
    path: canonicalPath,
    openGraphTitle: "Блог kartochki.online",
    openGraphDescription:
      "Практические статьи для продавцов на Wildberries, Ozon и Яндекс Маркете: фото, инфографика и оформление карточек.",
  });
}

export default async function BlogRoute({ searchParams }: BlogRouteProps) {
  const page = getBlogPageNumber((await searchParams)?.page);
  const content = await getBlogPageContent(page);

  return <BlogPage content={content} />;
}
