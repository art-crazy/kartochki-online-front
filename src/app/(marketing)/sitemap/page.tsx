import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { SiteMapPage } from "@/views/site-map/ui/SiteMapPage";

export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Карта сайта | kartochki.online",
  description:
    "HTML-карта сайта kartochki.online со ссылками на ключевые коммерческие страницы, категорийные хабы и статьи блога.",
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
