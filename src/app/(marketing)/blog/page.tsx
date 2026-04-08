import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site";
import { BlogPage } from "@/views/blog/ui/BlogPage";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Советы и инструкции для продавцов Wildberries, Ozon и Яндекс Маркета: требования к фото, инфографика, оформление карточек и рост конверсии.",
  alternates: {
    canonical: `${siteConfig.defaultUrl}/blog`,
  },
  openGraph: {
    title: "Блог kartochki.online",
    description:
      "Практические статьи для продавцов на Wildberries, Ozon и Яндекс Маркете: фото, инфографика и оформление карточек.",
    url: `${siteConfig.defaultUrl}/blog`,
  },
};

export default function BlogRoute() {
  return <BlogPage />;
}
