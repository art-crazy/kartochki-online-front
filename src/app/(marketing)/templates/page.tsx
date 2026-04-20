import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { TemplatesIndexPage } from "@/views/template-landing/ui/TemplatesIndexPage";

export const revalidate = 86_400;

export const metadata: Metadata = buildPageMetadata({
  title: "Шаблоны карточек товаров для маркетплейсов | kartochki.online",
  description:
    "Готовые шаблоны карточек по категориям: одежда, электроника, косметика, товары для дома. Для Wildberries, Ozon и Яндекс Маркет.",
  path: "/templates",
  keywords: [
    "шаблоны карточек товаров",
    "шаблон карточки маркетплейс",
    "готовые шаблоны карточек wildberries ozon",
  ],
});

export default function TemplatesIndexRoute() {
  return <TemplatesIndexPage />;
}
