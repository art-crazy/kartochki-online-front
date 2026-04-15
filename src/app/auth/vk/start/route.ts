import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVkOAuthParams, normalizeVkOrigin } from "@/features/auth/model/vkAuth";
import { getSafeNextPath } from "@/features/auth/model/validation";

const isProduction = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = normalizeVkOrigin(requestUrl.origin);
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const params = await getVkOAuthParams(origin);

  if (!params) {
    return NextResponse.redirect(new URL("/auth", origin));
  }

  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, path: "/", secure: isProduction };
  const cookieStore = await cookies();
  cookieStore.set("vk_auth_state", params.state, cookieOptions);
  cookieStore.set("vk_auth_code_verifier", params.codeVerifier, cookieOptions);
  cookieStore.set("vk_auth_next", nextPath, cookieOptions);

  return NextResponse.redirect(params.authUrl);
}
