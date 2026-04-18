"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { loginWithYandexWidgetMutation } from "@/shared/api";
import { useAuthTransition } from "@/shared/auth/model/useAuthTransition";
import { getYandexTokenHash } from "../model/yandexAuth";
import { getSafeNextPath } from "../model/validation";

export function YandexTokenHandler() {
  const router = useRouter();
  const { completeLogin } = useAuthTransition();
  const tokenHandledRef = useRef(false);
  const { mutate: loginWithYandexWidget } = useMutation({
    ...loginWithYandexWidgetMutation(),
    onSuccess: () => {
      const { state } = getYandexTokenHash(window.location.hash);
      completeLogin(getSafeNextPath(state));
    },
    onError: () => {
      router.replace("/auth?error=yandex_auth_failed");
    },
  });

  useEffect(() => {
    if (tokenHandledRef.current) {
      return;
    }

    const { accessToken } = getYandexTokenHash(window.location.hash);

    if (!accessToken) {
      router.replace("/auth");
      return;
    }

    tokenHandledRef.current = true;
    loginWithYandexWidget({ body: { access_token: accessToken } });
  }, [loginWithYandexWidget, router]);

  return <main aria-hidden />;
}
