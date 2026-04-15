import type { FormEvent } from "react";
import styles from "./AuthFlow.module.scss";
import { classNames } from "@/shared/lib/classNames";
import type { LoadingAction, LoginErrors } from "../model/types";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { Spinner } from "./Spinner";

type LoginScreenProps = {
  email: string;
  errors: LoginErrors;
  loadingAction: LoadingAction | null;
  onEmailChange: (value: string) => void;
  onForgotClick: () => void;
  onPasswordChange: (value: string) => void;
  onRegisterClick: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
  passwordVisible: boolean;
  setPasswordVisible: (updater: (value: boolean) => boolean) => void;
  socialAuthError: string;
  socialAuthPending: boolean;
  yandexFallbackUrl: string;
};

export function LoginScreen({
  email,
  errors,
  loadingAction,
  onEmailChange,
  onForgotClick,
  onPasswordChange,
  onRegisterClick,
  onSubmit,
  password,
  passwordVisible,
  setPasswordVisible,
  socialAuthError,
  socialAuthPending,
  yandexFallbackUrl,
}: LoginScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="auth-login-title">
      <h1 id="auth-login-title" className={styles.heading}>
        Добро пожаловать
      </h1>
      <p className={styles.subheading}>Войдите, чтобы продолжить генерацию карточек</p>

      <SocialAuthButtons error={socialAuthError} isPending={socialAuthPending} yandexFallbackUrl={yandexFallbackUrl} />

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            autoComplete="email"
            className={classNames(styles.input, errors.email && styles.inputError)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
          {errors.email ? <span id="login-email-error" className={styles.errorText}>{errors.email}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.fieldHeader}>
            <span className={styles.label}>Пароль</span>
            <button type="button" className={styles.inlineLink} onClick={onForgotClick}>
              Забыли пароль?
            </button>
          </span>
          <span className={styles.passwordWrap}>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              autoComplete="current-password"
              className={classNames(styles.input, errors.password && styles.inputError)}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
            />
            <button type="button" className={styles.passwordToggle} onClick={() => setPasswordVisible((value) => !value)}>
              {passwordVisible ? "Скрыть" : "Показать"}
            </button>
          </span>
          {errors.password ? <span id="login-password-error" className={styles.errorText}>{errors.password}</span> : null}
        </label>

        <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
          {loadingAction === "login" ? <Spinner /> : null}
          <span className={loadingAction === "login" ? styles.buttonTextLoading : undefined}>Войти</span>
        </button>
      </form>

      <p className={styles.footerText}>
        Нет аккаунта?{" "}
        <button type="button" className={styles.footerLink} onClick={onRegisterClick}>
          Зарегистрироваться
        </button>
      </p>
    </section>
  );
}
