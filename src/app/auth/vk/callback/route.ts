import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVkRedirectUri } from "@/features/auth/model/vkAuth";
import { loginWithVkOAuth } from "@/shared/api";
import { getSafeNextPath } from "@/features/auth/model/validation";
import { siteConfig } from "@/shared/config/site";

const isProduction = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code") ?? "";
  const deviceId = requestUrl.searchParams.get("device_id") ?? "";
  const returnedState = requestUrl.searchParams.get("state") ?? "";

  const cookieStore = await cookies();
  const savedState = cookieStore.get("vk_auth_state")?.value ?? "";
  const codeVerifier = cookieStore.get("vk_auth_code_verifier")?.value ?? "";
  const nextPath = getSafeNextPath(cookieStore.get("vk_auth_next")?.value ?? "");

  const authErrorUrl = new URL("/auth?error=vk_auth_failed", siteConfig.appUrl);

  if (!code || !deviceId || !codeVerifier || !savedState || returnedState !== savedState) {
    return NextResponse.redirect(authErrorUrl);
  }

  cookieStore.delete("vk_auth_state");
  cookieStore.delete("vk_auth_code_verifier");
  cookieStore.delete("vk_auth_next");

  const result = await loginWithVkOAuth({
    body: { code, device_id: deviceId, code_verifier: codeVerifier, redirect_uri: getVkRedirectUri(siteConfig.appUrl) },
  });

  if (result.error) {
    console.error("[vk/callback] loginWithVkOAuth error:", JSON.stringify(result.error));
    return NextResponse.redirect(authErrorUrl);
  }

  const token = result.data?.session?.access_token;
  if (token) {
    const expiresAt = result.data.session.expires_at;
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProduction,
      expires: expiresAt ? new Date(expiresAt) : undefined,
    });
  }

  return NextResponse.redirect(new URL(nextPath, siteConfig.appUrl));
}
