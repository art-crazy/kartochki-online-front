import type { FormEvent } from "react";
import styles from "./AuthFlow.module.scss";
import { classNames } from "@/shared/lib/classNames";
import type { ForgotErrors, LoadingAction } from "../model/types";
import { ArrowLeftIcon } from "./AuthIcons";
import { Spinner } from "./Spinner";

type ForgotPasswordScreenProps = {
  email: string;
  errors: ForgotErrors;
  loadingAction: LoadingAction | null;
  onEmailChange: (value: string) => void;
  onLoginClick: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ForgotPasswordScreen({
  email,
  errors,
  loadingAction,
  onEmailChange,
  onLoginClick,
  onSubmit,
}: ForgotPasswordScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="auth-forgot-title">
      <button type="button" className={styles.backLink} onClick={onLoginClick}>
        <ArrowLeftIcon />
        <span>Назад</span>
      </button>

      <h1 id="auth-forgot-title" className={styles.heading}>
        Забыли пароль?
      </h1>
      <p className={styles.subheading}>Введите email, и мы пришлём ссылку для сброса пароля</p>

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
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
          />
          {errors.email ? <span id="forgot-email-error" className={styles.errorText}>{errors.email}</span> : null}
        </label>

        <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
          {loadingAction === "forgot" ? <Spinner /> : null}
          <span className={loadingAction === "forgot" ? styles.buttonTextLoading : undefined}>Отправить ссылку</span>
        </button>
      </form>

      <p className={styles.footerText}>
        Вспомнили пароль?{" "}
        <button type="button" className={styles.footerLink} onClick={onLoginClick}>
          Войти
        </button>
      </p>
    </section>
  );
}
