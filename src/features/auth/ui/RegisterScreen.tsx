import Link from "next/link";
import type { FormEvent } from "react";
import styles from "./AuthFlow.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { FREE_PLAN_SHORT_SUMMARY } from "@/shared/config/pricing";
import type { getPasswordStrength } from "../model/validation";
import type { LoadingAction, RegisterErrors } from "../model/types";
import { PasswordStrength } from "./PasswordStrength";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { Spinner } from "./Spinner";

type RegisterScreenProps = {
  email: string;
  errors: RegisterErrors;
  loadingAction: LoadingAction | null;
  name: string;
  onEmailChange: (value: string) => void;
  onLoginClick: () => void;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
  passwordStrength: ReturnType<typeof getPasswordStrength>;
  passwordVisible: boolean;
  setPasswordVisible: (updater: (value: boolean) => boolean) => void;
  socialAuthError: string;
  socialAuthPending: boolean;
  yandexAuthUrl: string;
  vkAuthUrl: string;
};

export function RegisterScreen({
  email,
  errors,
  loadingAction,
  name,
  onEmailChange,
  onLoginClick,
  onNameChange,
  onPasswordChange,
  onSubmit,
  password,
  passwordStrength,
  passwordVisible,
  setPasswordVisible,
  socialAuthError,
  socialAuthPending,
  yandexAuthUrl,
  vkAuthUrl,
}: RegisterScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="auth-register-title">
      <h1 id="auth-register-title" className={styles.heading}>
        Создать аккаунт
      </h1>
      <p className={styles.subheading}>{FREE_PLAN_SHORT_SUMMARY}</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

        <label className={styles.field}>
          <span className={styles.label}>Имя</span>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            autoComplete="name"
            className={classNames(styles.input, errors.name && styles.inputError)}
            placeholder="Иван Иванов"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
          />
          {errors.name ? <span id="register-name-error" className={styles.errorText}>{errors.name}</span> : null}
        </label>

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
            aria-describedby={errors.email ? "register-email-error" : undefined}
          />
          {errors.email ? <span id="register-email-error" className={styles.errorText}>{errors.email}</span> : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <span className={styles.passwordWrap}>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              autoComplete="new-password"
              className={classNames(styles.input, errors.password && styles.inputError)}
              placeholder="Минимум 8 символов"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={[
                errors.password ? "register-password-error" : null,
                password ? "password-strength-text" : null,
              ].filter(Boolean).join(" ") || undefined}
            />
            <button type="button" className={styles.passwordToggle} onClick={() => setPasswordVisible((value) => !value)}>
              {passwordVisible ? "Скрыть" : "Показать"}
            </button>
          </span>

          {password ? <PasswordStrength value={passwordStrength} /> : null}
          {errors.password ? <span id="register-password-error" className={styles.errorText}>{errors.password}</span> : null}
        </label>

        <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
          {loadingAction === "register" ? <Spinner /> : null}
          <span className={loadingAction === "register" ? styles.buttonTextLoading : undefined}>Создать аккаунт</span>
        </button>

        <SocialAuthButtons error={socialAuthError} isPending={socialAuthPending} yandexAuthUrl={yandexAuthUrl} vkAuthUrl={vkAuthUrl} />
      </form>

      <p className={styles.terms}>
        Регистрируясь, вы соглашаетесь с{" "}
        <Link href="/" className={styles.termsLink}>
          условиями использования
        </Link>{" "}
        и{" "}
        <Link href="/" className={styles.termsLink}>
          политикой конфиденциальности
        </Link>
        .
      </p>

      <p className={styles.footerText}>
        Уже есть аккаунт?{" "}
        <button type="button" className={styles.footerLink} onClick={onLoginClick}>
          Войти
        </button>
      </p>
    </section>
  );
}
