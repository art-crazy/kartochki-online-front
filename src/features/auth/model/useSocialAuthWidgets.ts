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
import { clearVkAuthParams, ensureVkAuthParams, type VkAuthParams } from "./vkAuthParams";
import {
  getYandexAccessToken,
  getYandexRedirectUri,
  yandexClientId,
  type YaAuthSuggest,
} from "./yandexAuth";

type VkLoginPayload = {
  code?: unknown;
  device_id?: unknown;
  state?: unknown;
};

type VkWidgetRenderResult = {
  on: (event: string, handler: (payload: VkLoginPayload) => void) => VkWidgetRenderResult;
};

type VkOneTapStyles = {
  width?: number;
  height?: number;
  borderRadius?: number;
};

type VkOneTap = {
  render: (params: {
    container: HTMLElement;
    showAlternativeLogin?: boolean;
    styles?: VkOneTapStyles;
  }) => VkWidgetRenderResult;
};

type VkIdSdk = {
  Config: {
    init: (params: {
      app: number;
      redirectUrl: string;
      responseMode: string;
      source?: string;
      scope?: string;
      state?: string;
      codeVerifier?: string;
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

const vkAppId = Number(process.env.NEXT_PUBLIC_VK_ID_APP_ID);
const isValidVkAppId = Number.isInteger(vkAppId) && vkAppId > 0;
const vkOneTapMaxWidth = 450;
const vkOneTapHeight = 56;
const vkOneTapBorderRadius = 8;

export function useSocialAuthWidgets(screen: AuthScreen) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const [vkSdkReady, setVkSdkReady] = useState(false);
  const [yandexSdkReady, setYandexSdkReady] = useState(false);
  const [socialAuthError, setSocialAuthError] = useState("");
  const vkContainerRef = useRef<HTMLElement | null>(null);
  const vkAuthParamsRef = useRef<VkAuthParams | null>(null);
  const yandexInitializedRef = useRef(false);
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
    onSuccess: () => {
      clearVkAuthParams(vkAuthParamsRef);
      completeAuth();
    },
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
    const redirectUri = `${window.location.origin}/auth`;
    const authParams = ensureVkAuthParams(vkAuthParamsRef);

    VKID.Config.init({
      app: vkAppId,
      redirectUrl: redirectUri,
      responseMode: VKID.ConfigResponseMode.Callback,
      source: VKID.ConfigSource.LOWCODE,
      state: authParams.state,
      codeVerifier: authParams.codeVerifier,
      scope: "",
    });

    const oneTap = new VKID.OneTap();
    const width = getVkWidgetWidth(container);

    oneTap
      .render({
        container,
        showAlternativeLogin: true,
        styles: {
          width,
          height: vkOneTapHeight,
          borderRadius: vkOneTapBorderRadius,
        },
      })
      .on(VKID.WidgetEvents.ERROR, () => {
        setSocialAuthError("Не удалось загрузить VK ID");
      })
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload) => {
        const code = typeof payload.code === "string" ? payload.code : "";
        const deviceId = typeof payload.device_id === "string" ? payload.device_id : "";
        const state = typeof payload.state === "string" ? payload.state : "";
        const latestAuthParams = vkAuthParamsRef.current;

        if (!code || !deviceId || !latestAuthParams || state !== latestAuthParams.state) {
          setSocialAuthError("VK ID не вернул данные для входа");
          return;
        }

        setSocialAuthError("");
        loginWithVkWidget({
          body: {
            code,
            device_id: deviceId,
            code_verifier: latestAuthParams.codeVerifier,
            redirect_uri: redirectUri,
          },
        });
      });
  }, [isVisible, loginWithVkWidget, vkSdkReady]);

  useEffect(() => {
    if (!isVisible || !yandexSdkReady || !yandexClientId || !window.YaAuthSuggest) {
      return;
    }

    if (yandexInitializedRef.current) {
      return;
    }

    yandexInitializedRef.current = true;

    const origin = window.location.origin;
    const redirectUri = getYandexRedirectUri(origin);
    let isCancelled = false;

    window.YaAuthSuggest.init(
      {
        client_id: yandexClientId,
        response_type: "token",
        redirect_uri: redirectUri,
      },
      origin,
    )
      .then(({ handler }) => {
        if (!handler) {
          throw new Error("Yandex ID did not return an auth handler");
        }

        return handler();
      })
      .then((data) => {
        if (isCancelled) {
          return;
        }

        const accessToken = getYandexAccessToken(data);
        if (!accessToken) {
          setSocialAuthError("Яндекс ID не вернул токен для входа");
          return;
        }

        setSocialAuthError("");
        loginWithYandexWidget({ body: { access_token: accessToken } });
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        yandexInitializedRef.current = false;
        setSocialAuthError("Не удалось отобразить виджет Яндекс ID");
      });

    return () => {
      isCancelled = true;
    };
  }, [isVisible, loginWithYandexWidget, yandexSdkReady]);

  return {
    onVkSdkLoad: () => setVkSdkReady(true),
    onYandexSdkLoad: () => setYandexSdkReady(true),
    onYandexSdkError: () => {
      setSocialAuthError("Не удалось загрузить виджет Яндекс ID");
    },
    socialAuthError,
    socialAuthPending: isVkPending || isYandexPending,
  };
}

function getVkWidgetWidth(container: HTMLElement) {
  const measuredWidth = Math.floor(container.getBoundingClientRect().width);

  if (!measuredWidth) {
    return vkOneTapMaxWidth;
  }

  return Math.min(measuredWidth, vkOneTapMaxWidth);
}
