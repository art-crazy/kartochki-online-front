"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type YaSendSuggestToken = (origin: string, extraData?: Record<string, unknown>) => void;

declare global {
  interface Window {
    YaSendSuggestToken?: YaSendSuggestToken;
  }
}

export function YandexTokenPage() {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!sdkReady || !window.YaSendSuggestToken) {
      return;
    }

    window.YaSendSuggestToken(window.location.origin, {
      source: "auth_token_page",
      timestamp: Date.now(),
    });
  }, [sdkReady]);

  return (
    <>
      <Script
        src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <main aria-hidden />
    </>
  );
}
