import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/seo";
import { HomePage } from "@/views/home/ui/HomePage";

export const metadata: Metadata = buildPageMetadata({
  title: "Генератор карточек товаров для Wildberries, Ozon и Яндекс Маркета | kartochki.online",
  description:
    "Создавайте карточки товаров для Wildberries, Ozon и Яндекс Маркета: инфографика, фото на белом фоне, SEO-описания и готовые изображения для маркетплейсов за минуты.",
  keywords: [
    "генератор карточек товаров",
    "генератор карточек для маркетплейсов",
    "карточки для Wildberries",
    "карточки для Ozon",
    "карточки для Яндекс Маркета",
    "инфографика для маркетплейсов",
    "фото для маркетплейсов",
    "описание товара для маркетплейсов",
    "seo описание товара",
    "ии генератор карточек",
  ],
  path: "/",
  openGraphTitle: "Генератор карточек товаров для маркетплейсов",
  openGraphDescription:
    "Загрузите фото товара и получите готовые карточки для Wildberries, Ozon и Яндекс Маркета с инфографикой, фоном и текстами.",
});

export default function HomeRoute() {
  return <HomePage />;
}
