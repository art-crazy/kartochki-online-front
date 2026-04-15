"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { loginWithYandexWidgetMutation } from "@/shared/api";
import { getYandexTokenHash, yandexTokenScriptSrc } from "../model/yandexAuth";
import { getSafeNextPath } from "../model/validation";

type YaSendSuggestToken = (origin: string, extraData?: Record<string, unknown>) => void;

declare global {
  interface Window {
    YaSendSuggestToken?: YaSendSuggestToken;
  }
}

export function YandexTokenHandler() {
  const router = useRouter();
  const [sdkReady, setSdkReady] = useState(false);
  const tokenHandledRef = useRef(false);
  const { mutate: loginWithYandexWidget } = useMutation({
    ...loginWithYandexWidgetMutation(),
    onSuccess: () => {
      const { state } = getYandexTokenHash(window.location.hash);
      router.replace(getSafeNextPath(state));
      router.refresh();
    },
    onError: () => {
      router.replace("/auth");
    },
  });

  useEffect(() => {
    if (!sdkReady || !window.YaSendSuggestToken) {
      return;
    }

    window.YaSendSuggestToken(window.location.origin, {
      source: "auth_token_page",
      timestamp: Date.now(),
    });
  }, [sdkReady]);

  useEffect(() => {
    if (window.opener) {
      return;
    }

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

  return (
    <>
      <Script
        src={yandexTokenScriptSrc}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onReady={() => setSdkReady(true)}
      />
      <main aria-hidden />
    </>
  );
}
