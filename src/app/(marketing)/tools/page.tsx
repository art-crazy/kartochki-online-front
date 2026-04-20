import type { Metadata } from "next";
import { buildPageMetadata, MARKETING_PAGE_REVALIDATE } from "@/shared/seo";
import { ToolsIndexPage } from "@/views/tool-landing/ui/ToolsIndexPage";

export const revalidate = MARKETING_PAGE_REVALIDATE;

export const metadata: Metadata = buildPageMetadata({
  title: "Инструменты для маркетплейсов — генератор карточек и инфографики | kartochki.online",
  description:
    "ИИ-инструменты для продавцов на маркетплейсах: генератор карточек товаров, конструктор инфографики, удаление фона и SEO-тексты.",
  path: "/tools",
  keywords: [
    "инструменты для маркетплейсов",
    "генератор карточек онлайн",
    "инфографика для маркетплейсов онлайн",
  ],
});

export default function ToolsIndexRoute() {
  return <ToolsIndexPage />;
}
