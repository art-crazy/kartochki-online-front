"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  loginWithVkWidgetMutation,
  loginWithYandexWidgetMutation,
  type ErrorResponse,
} from "@/shared/api";
import type { AuthScreen } from "./types";
import { getSafeNextPath } from "./validation";

type YaAuthSuggestInitResult = {
  handler: () => Promise<unknown>;
};

type YaAuthSuggest = {
  init: (
    oauthQueryParams: Record<string, string>,
    tokenPageOrigin: string,
    suggestParams?: Record<string, string | number>,
  ) => Promise<YaAuthSuggestInitResult>;
};

type VkLoginPayload = {
  code?: unknown;
  device_id?: unknown;
};

type VkWidgetRenderResult = {
  on: (event: string, handler: (payload: VkLoginPayload) => void) => VkWidgetRenderResult;
};

type VkOneTap = {
  render: (params: { container: HTMLElement; showAlternativeLogin?: boolean }) => VkWidgetRenderResult;
};

type VkIdSdk = {
  Config: {
    init: (params: {
      app: number;
      redirectUrl: string;
      responseMode: string;
      source?: string;
      scope?: string;
    }) => void;
  };
  ConfigResponseMode: {
    Callback: string;
  };
  ConfigSource: {
    LOWCODE: string;
  };
  OneTap: new () => VkOneTap;
  OneTapInternalEvents: {
    LOGIN_SUCCESS: string;
  };
  WidgetEvents: {
    ERROR: string;
  };
};

declare global {
  interface Window {
    VKIDSDK?: VkIdSdk;
    YaAuthSuggest?: YaAuthSuggest;
  }
}

const yandexClientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID ?? "";
const vkAppId = Number(process.env.NEXT_PUBLIC_VK_ID_APP_ID);
const isValidVkAppId = Number.isInteger(vkAppId) && vkAppId > 0;

export function useSocialAuthWidgets(screen: AuthScreen) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const [vkSdkReady, setVkSdkReady] = useState(false);
  const [yandexSdkReady, setYandexSdkReady] = useState(false);
  const [socialAuthError, setSocialAuthError] = useState("");
  const vkContainerRef = useRef<HTMLElement | null>(null);
  const yandexContainerRef = useRef<HTMLElement | null>(null);
  const isVisible = screen === "login" || screen === "register";
  const completeAuth = useCallback(() => {
    router.push(nextPath);
    router.refresh();
  }, [nextPath, router]);

  const {
    isPending: isVkPending,
    mutate: loginWithVkWidget,
  } = useMutation({
    ...loginWithVkWidgetMutation(),
    onSuccess: completeAuth,
    onError: (error: ErrorResponse) => {
      setSocialAuthError(error.message ?? "Не удалось войти через VK ID");
    },
  });

  const {
    isPending: isYandexPending,
    mutate: loginWithYandexWidget,
  } = useMutation({
    ...loginWithYandexWidgetMutation(),
    onSuccess: completeAuth,
    onError: (error: ErrorResponse) => {
      setSocialAuthError(error.message ?? "Не удалось войти через Яндекс ID");
    },
  });

  useEffect(() => {
    if (!isVisible || !vkSdkReady || !window.VKIDSDK || !isValidVkAppId) {
      return;
    }

    const container = document.getElementById("vk-auth-container");
    if (!container || vkContainerRef.current === container) {
      return;
    }

    vkContainerRef.current = container;
    container.innerHTML = "";

    const VKID = window.VKIDSDK;
    VKID.Config.init({
      app: vkAppId,
      redirectUrl: `${window.location.origin}/auth`,
      responseMode: VKID.ConfigResponseMode.Callback,
      source: VKID.ConfigSource.LOWCODE,
      scope: "",
    });

    const oneTap = new VKID.OneTap();
    oneTap
      .render({
        container,
        showAlternativeLogin: true,
      })
      .on(VKID.WidgetEvents.ERROR, () => {
        setSocialAuthError("Не удалось загрузить VK ID");
      })
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload) => {
        const code = typeof payload.code === "string" ? payload.code : "";
        const deviceId = typeof payload.device_id === "string" ? payload.device_id : "";

        if (!code || !deviceId) {
          setSocialAuthError("VK ID не вернул данные для входа");
          return;
        }

        setSocialAuthError("");
        loginWithVkWidget({ body: { code, device_id: deviceId } });
      });
  }, [isVisible, loginWithVkWidget, vkSdkReady]);

  useEffect(() => {
    if (!isVisible || !yandexSdkReady || !yandexClientId || !window.YaAuthSuggest) {
      return;
    }

    const container = document.getElementById("yandex-auth-container");
    if (!container || yandexContainerRef.current === container) {
      return;
    }

    yandexContainerRef.current = container;
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
        buttonBorderRadius: 8,
      },
    )
      .then(({ handler }) => handler())
      .then((data) => {
        const accessToken = getYandexAccessToken(data);
        if (!accessToken) {
          setSocialAuthError("Яндекс ID не вернул токен для входа");
          return;
        }

        setSocialAuthError("");
        loginWithYandexWidget({ body: { access_token: accessToken } });
      })
      .catch(() => {
        yandexContainerRef.current = null;
        setSocialAuthError("Не удалось загрузить Яндекс ID");
      });
  }, [isVisible, loginWithYandexWidget, yandexSdkReady]);

  return {
    onVkSdkLoad: () => setVkSdkReady(true),
    onYandexSdkLoad: () => setYandexSdkReady(true),
    socialAuthError,
    socialAuthPending: isVkPending || isYandexPending,
  };
}

function getYandexAccessToken(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const token = (data as { access_token?: unknown; token?: unknown }).access_token
    ?? (data as { token?: unknown }).token;
  return typeof token === "string" ? token : "";
}
