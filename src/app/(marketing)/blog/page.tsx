import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site";
import { BlogPage } from "@/views/blog/ui/BlogPage";

export const metadata: Metadata = {
  title: "Блог",
  description: "Статьи для продавцов на маркетплейсах: требования к карточкам, фото, инфографика и рост конверсии.",
  alternates: {
    canonical: `${siteConfig.defaultUrl}/blog`,
  },
  openGraph: {
    title: "Блог kartochki.online",
    description: "Практические статьи для продавцов на Wildberries, Ozon и Яндекс Маркет.",
    url: `${siteConfig.defaultUrl}/blog`,
  },
};

export default function BlogRoute() {
  return <BlogPage />;
}
