import { NextResponse } from "next/server";
import type { ForgotPasswordRequest, StatusResponse } from "@/shared/api";
import { parseJsonBody } from "@/shared/auth/http";
import { backendRequest } from "@/shared/auth/server";

export async function POST(request: Request) {
  const parsedBody = await parseJsonBody<ForgotPasswordRequest>(request);

  if (!parsedBody.ok) {
    return parsedBody.response;
  }

  const result = await backendRequest<StatusResponse>({
    path: "/api/v1/auth/forgot-password",
    method: "POST",
    body: parsedBody.data,
  });

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.status });
  }

  return NextResponse.json(result.data, { status: result.status });
}
