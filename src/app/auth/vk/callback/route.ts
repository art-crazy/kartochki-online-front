import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSafeNextPath } from "@/features/auth/model/validation";
import { siteConfig } from "@/shared/config/site";

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

  // Передаём параметры на client-side страницу через URL, чтобы браузер сам вызвал backend.
  // Это нужно для корректной установки куки auth_token: backend ставит её напрямую в браузер,
  // а не через промежуточный Next.js сервер (где домен куки не совпадает с api.kartochki-online.ru).
  const tokenUrl = new URL("/auth/vk/token", siteConfig.appUrl);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("device_id", deviceId);
  tokenUrl.searchParams.set("code_verifier", codeVerifier);
  tokenUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(tokenUrl);
}
