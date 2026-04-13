import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_PATH } from "@/shared/auth/config";
import type { AuthResponse, AuthUser, CurrentUserResponse, ErrorResponse, StatusResponse } from "@/shared/api";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type BackendRequestOptions = {
  path: string;
  method?: "GET" | "POST";
  body?: unknown;
  token?: string;
};

type BackendSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

type BackendFailure = {
  ok: false;
  status: number;
  error: ErrorResponse;
};

type BackendResult<T> = BackendSuccess<T> | BackendFailure;

export function getAuthCookieOptions(expiresAt?: string) {
  return {
    httpOnly: true,
    path: AUTH_COOKIE_PATH,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  };
}

export async function setAuthSession(session: AuthResponse["session"]) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, session.access_token, getAuthCookieOptions(session.expires_at));
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    expires: new Date(0),
  });
}

export async function getSessionToken() {
  const cookieStore = await cookies();

  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function backendRequest<T>({
  path,
  method = "GET",
  body,
  token,
}: BackendRequestOptions): Promise<BackendResult<T>> {
  const headers = new Headers();

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${backendBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const rawText = await response.text();
  const payload = rawText ? tryParseJson(rawText) : {};

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      data: payload as T,
    };
  }

  return {
    ok: false,
    status: response.status,
    error: normalizeError(payload, response.status, response.statusText),
  };
}

export async function getCurrentUserFromSession() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const result = await backendRequest<CurrentUserResponse>({
    path: "/api/v1/me",
    token,
  });

  if (!result.ok) {
    if (result.status === 401) {
      await clearAuthSession();
    }

    return null;
  }

  return result.data.user;
}

export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/auth");
  }

  return user;
}

export async function logoutCurrentSession() {
  const token = await getSessionToken();

  if (!token) {
    await clearAuthSession();
    return {
      ok: true,
      status: 200,
      data: { status: "logged_out" } satisfies StatusResponse,
    } as BackendSuccess<StatusResponse>;
  }

  const result = await backendRequest<StatusResponse>({
    path: "/api/v1/auth/logout",
    method: "POST",
    token,
  });

  await clearAuthSession();

  return result.ok
    ? result
    : {
        ok: true,
        status: 200,
        data: { status: "logged_out" } satisfies StatusResponse,
      };
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeError(payload: unknown, status: number, statusText: string): ErrorResponse {
  if (payload && typeof payload === "object" && "message" in payload && "code" in payload) {
    return payload as ErrorResponse;
  }

  if (typeof payload === "string" && payload.trim()) {
    return {
      code: `http_${status}`,
      message: payload,
    };
  }

  return {
    code: `http_${status}`,
    message: statusText || "Request failed",
  };
}
