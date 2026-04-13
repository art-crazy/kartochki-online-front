import { NextResponse } from "next/server";
import type { CurrentUserResponse } from "@/shared/api";
import { backendRequest, clearAuthSession, getSessionToken } from "@/shared/auth/server";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json(
      {
        code: "unauthorized",
        message: "Сессия не найдена",
      },
      { status: 401 },
    );
  }

  const result = await backendRequest<CurrentUserResponse>({
    path: "/api/v1/me",
    token,
  });

  if (!result.ok) {
    if (result.status === 401) {
      await clearAuthSession();
    }

    return NextResponse.json(result.error, { status: result.status });
  }

  return NextResponse.json(result.data, { status: result.status });
}
