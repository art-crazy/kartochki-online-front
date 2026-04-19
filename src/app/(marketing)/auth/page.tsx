import type { Metadata } from "next";
import { buildNoindexMetadata } from "@/shared/seo";
import { AuthPage } from "@/views/auth/ui/AuthPage";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Вход и регистрация",
  description: "Войдите в kartochki.online или создайте аккаунт, чтобы генерировать карточки товаров для маркетплейсов.",
  path: "/auth",
  openGraphTitle: "Вход в kartochki.online",
  openGraphDescription: "Авторизация и регистрация в сервисе генерации карточек товаров для маркетплейсов.",
});

export default function AuthRoute() {
  return <AuthPage />;
}
