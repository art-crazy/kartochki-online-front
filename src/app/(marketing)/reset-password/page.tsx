import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site";
import { ResetPasswordPage } from "@/views/auth/ui/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Сброс пароля",
  description: "Установите новый пароль для аккаунта kartochki.online.",
  alternates: {
    canonical: `${siteConfig.defaultUrl}/reset-password`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

type ResetPasswordRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordRoute({ searchParams }: ResetPasswordRouteProps) {
  const { token = "" } = await searchParams;

  return <ResetPasswordPage token={token} />;
}
