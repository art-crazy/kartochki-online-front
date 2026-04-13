import type { ErrorResponse } from "@/shared/api";
import type { ForgotErrors, LoginErrors, RegisterErrors } from "./types";

type AuthRequestResult =
  | { ok: true }
  | { ok: false; error: ErrorResponse };

export async function postAuthRequest(path: string, body: Record<string, unknown>): Promise<AuthRequestResult> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await parseResponseJson(response);

  if (response.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    error: normalizeErrorResponse(payload, response.status),
  };
}

async function parseResponseJson(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { message: rawText };
  }
}

function normalizeErrorResponse(payload: unknown, status: number): ErrorResponse {
  if (payload && typeof payload === "object" && "message" in payload && "code" in payload) {
    return payload as ErrorResponse;
  }

  return {
    code: `http_${status}`,
    message: "Не удалось выполнить запрос",
  };
}

export function mapLoginApiErrors(error: ErrorResponse): LoginErrors {
  const nextErrors: LoginErrors = {
    form: error.message,
  };

  for (const detail of error.details ?? []) {
    if (detail.field === "email" || detail.field === "password") {
      nextErrors[detail.field] = detail.message;
    }
  }

  return nextErrors;
}

export function mapRegisterApiErrors(error: ErrorResponse): RegisterErrors {
  const nextErrors: RegisterErrors = {
    form: error.message,
  };

  for (const detail of error.details ?? []) {
    if (detail.field === "name" || detail.field === "email" || detail.field === "password") {
      nextErrors[detail.field] = detail.message;
    }
  }

  return nextErrors;
}

export function mapForgotApiErrors(error: ErrorResponse): ForgotErrors {
  const nextErrors: ForgotErrors = {
    form: error.message,
  };

  for (const detail of error.details ?? []) {
    if (detail.field === "email") {
      nextErrors.email = detail.message;
    }
  }

  return nextErrors;
}
