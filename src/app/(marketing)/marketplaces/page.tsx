import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { MarketplacesIndexPage } from "@/views/marketplace-landing/ui/MarketplacesIndexPage";

export const revalidate = 86_400;

export const metadata: Metadata = buildPageMetadata({
  title: "Карточки для маркетплейсов — Wildberries, Ozon, Яндекс Маркет | kartochki.online",
  description:
    "Генератор карточек товаров с учётом требований каждого маркетплейса. Выберите площадку и создайте карточки с правильными размерами, фоном и инфографикой.",
  path: "/marketplaces",
  keywords: [
    "карточки для маркетплейсов",
    "генератор карточек wildberries ozon яндекс маркет",
    "оформление карточек маркетплейс",
  ],
});

export default function MarketplacesIndexRoute() {
  return <MarketplacesIndexPage />;
}
