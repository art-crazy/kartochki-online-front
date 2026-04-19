import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { HomePage } from "@/views/home/ui/HomePage";

export const metadata: Metadata = buildPageMetadata({
  title: "ИИ-генератор карточек товаров для Wildberries, Ozon и Яндекс Маркет",
  description:
    "Создавайте продающие карточки товаров для Wildberries, Ozon и Яндекс Маркет за 30 секунд: инфографика, фоны, SEO-тексты и готовые наборы карточек.",
  keywords: [
    "генератор карточек товаров",
    "карточки для Wildberries",
    "карточки для Ozon",
    "карточки для Яндекс Маркет",
    "инфографика для маркетплейсов",
    "ии генератор карточек",
  ],
  path: "/",
  openGraphTitle: "Карточки онлайн для WB, Ozon и Яндекс Маркет",
  openGraphDescription:
    "Загрузите фото товара и получите готовый набор карточек с инфографикой, правильным фоном и текстами для трёх маркетплейсов.",
});

export default function HomeRoute() {
  return <HomePage />;
}
