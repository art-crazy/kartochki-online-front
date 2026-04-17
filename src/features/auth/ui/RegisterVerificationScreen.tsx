import type { FormEvent } from "react";
import { formatSeconds } from "../model/validation";
import type { LoadingAction, VerifyErrors } from "../model/types";
import { ArrowLeftIcon } from "./AuthIcons";
import { Spinner } from "./Spinner";
import styles from "./AuthFlow.module.scss";
import { classNames } from "@/shared/lib/classNames";

type RegisterVerificationScreenProps = {
  code: string;
  codeLength: number;
  email: string;
  errors: VerifyErrors;
  expiresInSeconds: number;
  loadingAction: LoadingAction | null;
  onBackClick: () => void;
  onCodeChange: (value: string) => void;
  onResendClick: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resendInSeconds: number;
};

export function RegisterVerificationScreen({
  code,
  codeLength,
  email,
  errors,
  expiresInSeconds,
  loadingAction,
  onBackClick,
  onCodeChange,
  onResendClick,
  onSubmit,
  resendInSeconds,
}: RegisterVerificationScreenProps) {
  const isVerifying = loadingAction === "verify";
  const isResending = loadingAction === "resend";
  const canResend = resendInSeconds <= 0 && !isResending && !isVerifying;

  return (
    <section className={styles.screen} aria-labelledby="auth-register-verify-title">
      <button type="button" className={styles.backLink} onClick={onBackClick}>
        <ArrowLeftIcon />
        <span>Изменить email</span>
      </button>

      <h1 id="auth-register-verify-title" className={styles.heading}>
        Подтвердите email
      </h1>
      <p className={styles.subheading}>
        Мы отправили код на <strong>{email}</strong>. Введите {codeLength}-значный код из письма.
      </p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

        <label className={styles.field}>
          <span className={styles.fieldHeader}>
            <span className={styles.label}>Код подтверждения</span>
            <span className={styles.metaText}>Действует еще {formatSeconds(expiresInSeconds)}</span>
          </span>
          <input
            type="text"
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={codeLength}
            className={classNames(styles.input, styles.codeInput, errors.code && styles.inputError)}
            placeholder={"0".repeat(codeLength)}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? "register-code-error" : undefined}
          />
          {errors.code ? <span id="register-code-error" className={styles.errorText}>{errors.code}</span> : null}
        </label>

        <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
          {isVerifying ? <Spinner /> : null}
          <span className={isVerifying ? styles.buttonTextLoading : undefined}>Подтвердить email</span>
        </button>
      </form>

      <div className={styles.metaBlock}>
        <p className={styles.metaText}>Письмо не пришло? Проверьте папку «Спам» или отправьте код повторно.</p>
        <button type="button" className={styles.footerLink} onClick={onResendClick} disabled={!canResend}>
          {isResending ? "Отправляем..." : canResend ? "Отправить код повторно" : `Отправить снова через ${formatSeconds(resendInSeconds)}`}
        </button>
      </div>
    </section>
  );
}
