import { NextResponse } from "next/server";
import type { AuthResponse, LoginRequest } from "@/shared/api";
import { parseJsonBody } from "@/shared/auth/http";
import { backendRequest, setAuthSession } from "@/shared/auth/server";

export async function POST(request: Request) {
  const parsedBody = await parseJsonBody<LoginRequest>(request);

  if (!parsedBody.ok) {
    return parsedBody.response;
  }

  const result = await backendRequest<AuthResponse>({
    path: "/api/v1/auth/login",
    method: "POST",
    body: parsedBody.data,
  });

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.status });
  }

  await setAuthSession(result.data.session);

  return NextResponse.json({ user: result.data.user }, { status: result.status });
}
