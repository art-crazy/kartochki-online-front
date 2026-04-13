"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthScreen } from "./types";

type YaAuthSuggestInitResult = {
  handler: () => Promise<void>;
};

type YaAuthSuggest = {
  init: (
    oauthQueryParams: Record<string, string>,
    tokenPageOrigin: string,
    suggestParams?: Record<string, string | number>,
  ) => Promise<YaAuthSuggestInitResult>;
};

declare global {
  interface Window {
    YaAuthSuggest?: YaAuthSuggest;
  }
}

const yandexClientId =
  process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID ?? "e3069e26deea46b2b0da0a416a446100";

export function useYandexAuth(screen: AuthScreen) {
  const initializedContainerRef = useRef<HTMLElement | null>(null);
  const [yandexSdkReady, setYandexSdkReady] = useState(false);
  const [yandexError, setYandexError] = useState("");
  const isVisible = screen === "login" || screen === "register";

  useEffect(() => {
    if (!yandexSdkReady || !yandexClientId || !isVisible) {
      return;
    }

    const container = document.getElementById("yandex-auth-container");
    if (!container || !window.YaAuthSuggest) {
      return;
    }

    if (initializedContainerRef.current === container) {
      return;
    }

    initializedContainerRef.current = container;
    container.innerHTML = "";

    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/yandex/token`;

    window.YaAuthSuggest.init(
      {
        client_id: yandexClientId,
        response_type: "token",
        redirect_uri: redirectUri,
      },
      origin,
      {
        view: "button",
        parentId: "yandex-auth-container",
        buttonView: "main",
        buttonTheme: "light",
        buttonSize: "m",
        buttonBorderRadius: 10,
      },
    )
      .then(async ({ handler }) => {
        setYandexError("");
        await handler();
      })
      .catch((error) => {
        initializedContainerRef.current = null;
        setYandexError("Не удалось загрузить кнопку Яндекс ID. Проверьте доступность сервиса.");
        if (process.env.NODE_ENV !== "production") {
          console.warn("Yandex ID widget init failed", error);
        }
      });
  }, [isVisible, screen, yandexSdkReady]);

  return {
    onYandexSdkLoad: () => setYandexSdkReady(true),
    yandexError,
  };
}
