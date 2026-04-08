import type { Metadata } from "next";
import { HomePage } from "@/views/home/ui/HomePage";
import { siteConfig } from "@/shared/config/site";

export const metadata: Metadata = {
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
  alternates: {
    canonical: siteConfig.defaultUrl,
  },
  openGraph: {
    title: "Карточки онлайн для WB, Ozon и Яндекс Маркет",
    description:
      "Загрузите фото товара и получите готовый набор карточек с инфографикой, правильным фоном и текстами для трёх маркетплейсов.",
    url: siteConfig.defaultUrl,
  },
};

export default function HomeRoute() {
  return <HomePage />;
}
