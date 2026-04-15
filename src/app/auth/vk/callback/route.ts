import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVkRedirectUri, normalizeVkOrigin } from "@/features/auth/model/vkAuth";
import { loginWithVkWidget } from "@/shared/api";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = normalizeVkOrigin(requestUrl.origin);
  const code = requestUrl.searchParams.get("code") ?? "";
  const deviceId = requestUrl.searchParams.get("device_id") ?? "";
  const returnedState = requestUrl.searchParams.get("state") ?? "";

  const cookieStore = await cookies();
  const savedState = cookieStore.get("vk_auth_state")?.value ?? "";
  const codeVerifier = cookieStore.get("vk_auth_code_verifier")?.value ?? "";
  const nextPath = cookieStore.get("vk_auth_next")?.value ?? "";

  const authErrorUrl = new URL("/auth?error=vk_auth_failed", requestUrl.origin);

  if (!code || !deviceId || !codeVerifier || !savedState || returnedState !== savedState) {
    return NextResponse.redirect(authErrorUrl);
  }

  cookieStore.delete("vk_auth_state");
  cookieStore.delete("vk_auth_code_verifier");
  cookieStore.delete("vk_auth_next");

  const result = await loginWithVkWidget({
    body: { code, device_id: deviceId, code_verifier: codeVerifier, redirect_uri: getVkRedirectUri(origin) },
  });

  if (result.error) {
    return NextResponse.redirect(authErrorUrl);
  }

  const redirectPath = nextPath ? new URL(nextPath, requestUrl.origin) : new URL("/dashboard", requestUrl.origin);
  const response = NextResponse.redirect(redirectPath);

  const setCookieHeader = result.response.headers.get("set-cookie");
  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  }

  return response;
}
