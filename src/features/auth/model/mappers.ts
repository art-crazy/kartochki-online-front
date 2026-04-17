import type { ErrorResponse } from "@/shared/api";
import type { ForgotErrors, LoginErrors, RegisterErrors, VerifyErrors } from "./types";

export function mapLoginErrors(error: ErrorResponse): LoginErrors {
  const mapped: LoginErrors = { form: error.message };
  for (const detail of error.details ?? []) {
    if (detail.field === "email" || detail.field === "password") {
      mapped[detail.field] = detail.message;
    }
  }
  return mapped;
}

export function mapRegisterErrors(error: ErrorResponse): RegisterErrors {
  const mapped: RegisterErrors = { form: error.message };
  for (const detail of error.details ?? []) {
    if (detail.field === "name" || detail.field === "email" || detail.field === "password") {
      mapped[detail.field] = detail.message;
    }
  }
  return mapped;
}

export function mapForgotErrors(error: ErrorResponse): ForgotErrors {
  const mapped: ForgotErrors = { form: error.message };
  for (const detail of error.details ?? []) {
    if (detail.field === "email") mapped.email = detail.message;
  }
  return mapped;
}

export function mapVerifyErrors(error: ErrorResponse): VerifyErrors {
  const mapped: VerifyErrors = { form: error.message };
  for (const detail of error.details ?? []) {
    if (detail.field === "code") mapped.code = detail.message;
  }
  return mapped;
}
