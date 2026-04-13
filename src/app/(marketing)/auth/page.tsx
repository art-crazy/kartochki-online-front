import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserFromSession } from "@/shared/auth/server";
import { siteConfig } from "@/shared/config/site";
import { AuthPage } from "@/views/auth/ui/AuthPage";

export const metadata: Metadata = {
  title: "Вход и регистрация",
  description: "Войдите в kartochki.online или создайте аккаунт, чтобы генерировать карточки товаров для маркетплейсов.",
  alternates: {
    canonical: `${siteConfig.defaultUrl}/auth`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Вход в kartochki.online",
    description: "Авторизация и регистрация в сервисе генерации карточек товаров для маркетплейсов.",
    url: `${siteConfig.defaultUrl}/auth`,
  },
};

export default async function AuthRoute() {
  const user = await getCurrentUserFromSession();

  if (user) {
    redirect("/app");
  }

  return <AuthPage />;
}
