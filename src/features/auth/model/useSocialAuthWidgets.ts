"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  loginWithVkWidgetMutation,
  type ErrorResponse,
} from "@/shared/api";
import type { AuthScreen } from "./types";
import { getSafeNextPath } from "./validation";
import { clearVkAuthParams, ensureVkAuthParams, type VkAuthParams } from "./vkAuthParams";

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
  const [socialAuthError, setSocialAuthError] = useState("");
  const vkContainerRef = useRef<HTMLElement | null>(null);
  const vkAuthParamsRef = useRef<VkAuthParams | null>(null);
  const isVisible = screen === "login" || screen === "register";
  const completeAuth = useCallback(() => {
    router.push(nextPath);
    router.refresh();
  }, [nextPath, router]);
  const yandexAuthUrl = `/auth/yandex/start?${new URLSearchParams({ next: nextPath }).toString()}`;

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

  return {
    onVkSdkLoad: () => setVkSdkReady(true),
    socialAuthError,
    socialAuthPending: isVkPending,
    yandexAuthUrl,
  };
}

function getVkWidgetWidth(container: HTMLElement) {
  const measuredWidth = Math.floor(container.getBoundingClientRect().width);

  if (!measuredWidth) {
    return vkOneTapMaxWidth;
  }

  return Math.min(measuredWidth, vkOneTapMaxWidth);
}
