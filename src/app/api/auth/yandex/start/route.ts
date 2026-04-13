import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  return NextResponse.redirect(`${baseUrl}/api/v1/auth/yandex/start`);
}
