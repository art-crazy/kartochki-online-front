import type { Metadata } from "next";
import { buildNoindexMetadata } from "@/shared/seo";
import { ResetPasswordPage } from "@/views/auth/ui/ResetPasswordPage";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Сброс пароля",
  description: "Установите новый пароль для аккаунта kartochki.online.",
  path: "/reset-password",
});

type ResetPasswordRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordRoute({ searchParams }: ResetPasswordRouteProps) {
  const { token = "" } = await searchParams;

  return <ResetPasswordPage token={token} />;
}
