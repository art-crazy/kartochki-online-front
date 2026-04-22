import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { SiteMapPage } from "@/views/site-map/ui/SiteMapPage";

export const revalidate = 86_400;

export const metadata: Metadata = buildPageMetadata({
  title: "Карта сайта | kartochki.online",
  description:
    "HTML-карта сайта kartochki.online со ссылками на основные разделы, страницы по маркетплейсам, инструменты, шаблоны и статьи блога.",
  path: "/sitemap",
  keywords: [
    "карта сайта kartochki.online",
    "страницы kartochki.online",
    "структура сайта kartochki.online",
  ],
});

export default function SiteMapRoute() {
  return <SiteMapPage />;
}
