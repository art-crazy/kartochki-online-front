"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { loginWithVkOAuthMutation } from "@/shared/api";
import { useAuthTransition } from "@/shared/auth/model/useAuthTransition";
import { getVkRedirectUri } from "../model/vkAuth";
import { getSafeNextPath } from "../model/validation";
import { siteConfig } from "@/shared/config/site";

export function VkTokenHandler() {
  const router = useRouter();
  const { completeLogin } = useAuthTransition();
  const searchParams = useSearchParams();
  const tokenHandledRef = useRef(false);

  const { mutate: loginWithVkOAuth } = useMutation({
    ...loginWithVkOAuthMutation(),
    onSuccess: () => {
      completeLogin(getSafeNextPath(searchParams.get("next")));
    },
    onError: () => {
      router.replace("/auth?error=vk_auth_failed");
    },
  });

  useEffect(() => {
    if (tokenHandledRef.current) {
      return;
    }

    const code = searchParams.get("code") ?? "";
    const deviceId = searchParams.get("device_id") ?? "";
    const codeVerifier = searchParams.get("code_verifier") ?? "";

    if (!code || !deviceId || !codeVerifier) {
      router.replace("/auth");
      return;
    }

    tokenHandledRef.current = true;
    loginWithVkOAuth({
      body: {
        code,
        device_id: deviceId,
        code_verifier: codeVerifier,
        redirect_uri: getVkRedirectUri(siteConfig.appUrl),
      },
    });
  }, [loginWithVkOAuth, router, searchParams]);

  return <main aria-hidden />;
}
