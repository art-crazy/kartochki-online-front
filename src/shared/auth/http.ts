import { NextResponse } from "next/server";

export async function parseJsonBody<T>(request: Request) {
  try {
    return {
      ok: true as const,
      data: (await request.json()) as T,
    };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          code: "invalid_json",
          message: "Некорректное тело запроса",
        },
        { status: 400 },
      ),
    };
  }
}
