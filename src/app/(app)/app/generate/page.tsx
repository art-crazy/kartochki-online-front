import type { Metadata } from "next";
import { GeneratePage } from "@/views/generate/ui/GeneratePage";

export const metadata: Metadata = {
  title: "Генерация карточек",
  description: "Рабочая зона для генерации карточек товара и готовых комплектов изображений.",
};

export default function GenerateRoute() {
  return <GeneratePage />;
}
