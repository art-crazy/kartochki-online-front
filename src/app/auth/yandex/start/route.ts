import { NextResponse } from "next/server";
import { getYandexOAuthUrl } from "@/features/auth/model/yandexAuth";
import { getSafeNextPath } from "@/features/auth/model/validation";
import { siteConfig } from "@/shared/config/site";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const authUrl = getYandexOAuthUrl(siteConfig.defaultUrl, nextPath);

  if (!authUrl) {
    return NextResponse.redirect(new URL("/auth", requestUrl.origin));
  }

  return NextResponse.redirect(authUrl);
}
