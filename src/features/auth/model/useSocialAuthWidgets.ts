"use client";

import { useSearchParams } from "next/navigation";
import { getSafeNextPath } from "./validation";

const socialAuthErrors: Record<string, string> = {
  vk_auth_failed: "Не удалось войти через VK ID",
  yandex_auth_failed: "Не удалось войти через Яндекс ID",
};

export function useSocialAuthWidgets() {
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const errorKey = searchParams.get("error") ?? "";
  const socialAuthError = socialAuthErrors[errorKey] ?? "";
  const yandexAuthUrl = `/auth/yandex/start?${new URLSearchParams({ next: nextPath }).toString()}`;
  const vkAuthUrl = `/auth/vk/start?${new URLSearchParams({ next: nextPath }).toString()}`;

  return {
    socialAuthError,
    socialAuthPending: false,
    yandexAuthUrl,
    vkAuthUrl,
  };
}
