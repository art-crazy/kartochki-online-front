import { NextResponse } from "next/server";
import { logoutCurrentSession } from "@/shared/auth/server";

export async function POST() {
  const result = await logoutCurrentSession();

  return NextResponse.json(result.data, { status: result.status });
}
