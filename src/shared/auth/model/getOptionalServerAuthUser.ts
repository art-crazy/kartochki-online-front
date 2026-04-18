import "server-only";

import { cookies, headers } from "next/headers";
import { getCurrentUser, type AuthUser } from "@/shared/api";
import { AUTH_COOKIE_NAMES } from "@/shared/auth/config";

export async function getOptionalServerAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const hasAuthCookie = AUTH_COOKIE_NAMES.some((cookieName) => cookieStore.has(cookieName));

  if (!hasAuthCookie) {
    return null;
  }

  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const result = await getCurrentUser({
    cache: "no-store",
    headers: {
      cookie: cookieHeader,
    },
  });

  if (result.error) {
    return null;
  }

  return result.data?.user ?? null;
}
