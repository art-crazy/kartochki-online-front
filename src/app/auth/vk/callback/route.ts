import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVkRedirectUri } from "@/features/auth/model/vkAuth";
import { loginWithVkOAuth } from "@/shared/api";
import { getSafeNextPath } from "@/features/auth/model/validation";
import { siteConfig } from "@/shared/config/site";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code") ?? "";
  const returnedState = requestUrl.searchParams.get("state") ?? "";

  const cookieStore = await cookies();
  const savedState = cookieStore.get("vk_auth_state")?.value ?? "";
  const codeVerifier = cookieStore.get("vk_auth_code_verifier")?.value ?? "";
  const nextPath = getSafeNextPath(cookieStore.get("vk_auth_next")?.value ?? "");

  const authErrorUrl = new URL("/auth?error=vk_auth_failed", siteConfig.appUrl);

  if (!code || !codeVerifier || !savedState || returnedState !== savedState) {
    return NextResponse.redirect(authErrorUrl);
  }

  cookieStore.delete("vk_auth_state");
  cookieStore.delete("vk_auth_code_verifier");
  cookieStore.delete("vk_auth_next");

  const result = await loginWithVkOAuth({
    body: { code, code_verifier: codeVerifier, redirect_uri: getVkRedirectUri(siteConfig.appUrl) },
  });

  if (result.error) {
    return NextResponse.redirect(authErrorUrl);
  }

  const response = NextResponse.redirect(new URL(nextPath, siteConfig.appUrl));

  const setCookieHeader = result.response.headers.get("set-cookie");
  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  }

  return response;
}
