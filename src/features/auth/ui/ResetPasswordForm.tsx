"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ErrorResponse } from "@/shared/api";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

type ResetPasswordErrors = {
  form?: string;
  password?: string;
  confirm?: string;
};

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ResetPasswordErrors = {};

    if (!token) {
      nextErrors.form = "Ссылка для сброса пароля недействительна";
    }

    if (password.length < 8) {
      nextErrors.password = "Пароль должен быть минимум 8 символов";
    }

    if (confirmPassword !== password) {
      nextErrors.confirm = "Пароли не совпадают";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const payload = await parseResponseJson(response);

      if (!response.ok) {
        const error = normalizeErrorResponse(payload, response.status);
        setErrors({
          form: error.message,
          password: error.details?.find((detail) => detail.field === "password")?.message,
        });
        return;
      }

      setIsSuccess(true);
      window.setTimeout(() => {
        router.push("/auth");
      }, 1200);
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.flow}>
        <section className={styles.screen}>
          <h1 className={styles.headingCentered}>Пароль обновлён</h1>
          <p className={styles.subheadingCentered}>Теперь войдите с новым паролем.</p>
          <Link href="/auth" className={styles.submitButton}>
            Перейти ко входу
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.flow}>
      <section className={styles.screen} aria-labelledby="reset-password-title">
        <h1 id="reset-password-title" className={styles.heading}>
          Новый пароль
        </h1>
        <p className={styles.subheading}>Установите новый пароль для аккаунта.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

          <label className={styles.field}>
            <span className={styles.label}>Новый пароль</span>
            <span className={styles.passwordWrap}>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({ ...current, password: undefined, form: undefined }));
                }}
                autoComplete="new-password"
                className={classNames(styles.input, errors.password && styles.inputError)}
                placeholder="Минимум 8 символов"
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setPasswordVisible((value) => !value)}>
                {passwordVisible ? "Скрыть" : "Показать"}
              </button>
            </span>
            {errors.password ? <span className={styles.errorText}>{errors.password}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Повторите пароль</span>
            <span className={styles.passwordWrap}>
              <input
                type={confirmVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((current) => ({ ...current, confirm: undefined, form: undefined }));
                }}
                autoComplete="new-password"
                className={classNames(styles.input, errors.confirm && styles.inputError)}
                placeholder="Повторите пароль"
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setConfirmVisible((value) => !value)}>
                {confirmVisible ? "Скрыть" : "Показать"}
              </button>
            </span>
            {errors.confirm ? <span className={styles.errorText}>{errors.confirm}</span> : null}
          </label>

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? "Сохраняем..." : "Сохранить пароль"}
          </button>
        </form>

        <p className={styles.footerText}>
          <Link href="/auth" className={styles.footerLink}>
            Вернуться ко входу
          </Link>
        </p>
      </section>
    </div>
  );
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
