"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

type AuthScreen = "login" | "register" | "forgot" | "forgot-sent";

type LoginErrors = {
  email?: string;
  password?: string;
};

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
};

type ForgotErrors = {
  email?: string;
};

type AuthFlowProps = {
  className?: string;
};

const emailPattern = /\S+@\S+\.\S+/;
const screenTabs: ReadonlyArray<{ screen: AuthScreen; label: string }> = [
  { screen: "login", label: "Вход" },
  { screen: "register", label: "Регистрация" },
  { screen: "forgot", label: "Пароль" },
  { screen: "forgot-sent", label: "Письмо" },
];

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className={styles.backIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M7.25 3.25 2.5 8l4.75 4.75M3 8h10.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.successMark} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />;
}

function validateEmail(email: string) {
  return emailPattern.test(email.trim());
}

function getPasswordStrength(password: string) {
  if (!password) {
    return { score: 0, label: "", tone: "neutral" as const };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-ZА-ЯЁ]/.test(password) || /[a-zа-яё]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password) || /[^a-zA-Zа-яА-ЯёЁ0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { score: 1, label: "Слабый пароль", tone: "weak" as const };
  }

  if (score === 2) {
    return { score: 2, label: "Средний пароль", tone: "medium" as const };
  }

  return { score: 3, label: "Надежный пароль", tone: "strong" as const };
}

export function AuthFlow({ className }: AuthFlowProps) {
  const router = useRouter();
  const submitTimeoutRef = useRef<number | null>(null);
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [sentEmail, setSentEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<"login" | "register" | "forgot" | "google" | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotErrors, setForgotErrors] = useState<ForgotErrors>({});

  const passwordStrength = useMemo(() => getPasswordStrength(registerPassword), [registerPassword]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const changeScreen = (nextScreen: AuthScreen) => {
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }

    setLoadingAction(null);
    setLoginErrors({});
    setRegisterErrors({});
    setForgotErrors({});
    setScreen(nextScreen);
  };

  const simulateAction = (action: NonNullable<typeof loadingAction>, callback: () => void) => {
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
    }

    setLoadingAction(action);
    submitTimeoutRef.current = window.setTimeout(() => {
      setLoadingAction(null);
      submitTimeoutRef.current = null;
      callback();
    }, 1200);
  };

  const handleGoogle = () => {
    simulateAction("google", () => {
      router.push("/app");
    });
  };

  const handleLoginEmailChange = (value: string) => {
    setLoginEmail(value);

    if (loginErrors.email) {
      setLoginErrors((current) => ({ ...current, email: undefined }));
    }
  };

  const handleLoginPasswordChange = (value: string) => {
    setLoginPassword(value);

    if (loginErrors.password) {
      setLoginErrors((current) => ({ ...current, password: undefined }));
    }
  };

  const handleRegisterNameChange = (value: string) => {
    setRegisterName(value);

    if (registerErrors.name) {
      setRegisterErrors((current) => ({ ...current, name: undefined }));
    }
  };

  const handleRegisterEmailChange = (value: string) => {
    setRegisterEmail(value);

    if (registerErrors.email) {
      setRegisterErrors((current) => ({ ...current, email: undefined }));
    }
  };

  const handleRegisterPasswordChange = (value: string) => {
    setRegisterPassword(value);

    if (registerErrors.password) {
      setRegisterErrors((current) => ({ ...current, password: undefined }));
    }
  };

  const handleForgotEmailChange = (value: string) => {
    setForgotEmail(value);

    if (forgotErrors.email) {
      setForgotErrors((current) => ({ ...current, email: undefined }));
    }
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!validateEmail(loginEmail)) {
      nextErrors.email = "Введите корректный email";
    }

    if (!loginPassword) {
      nextErrors.password = "Введите пароль";
    }

    setLoginErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    simulateAction("login", () => {
      router.push("/app");
    });
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: RegisterErrors = {};

    if (!registerName.trim()) {
      nextErrors.name = "Введите ваше имя";
    }

    if (!validateEmail(registerEmail)) {
      nextErrors.email = "Введите корректный email";
    }

    if (registerPassword.length < 8) {
      nextErrors.password = "Пароль должен быть минимум 8 символов";
    }

    setRegisterErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    simulateAction("register", () => {
      router.push("/app");
    });
  };

  const handleForgotSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ForgotErrors = {};

    if (!validateEmail(forgotEmail)) {
      nextErrors.email = "Введите корректный email";
    }

    setForgotErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    simulateAction("forgot", () => {
      setSentEmail(forgotEmail.trim());
      changeScreen("forgot-sent");
    });
  };

  return (
    <div className={classNames(styles.flow, className)}>
      <div className={styles.devTabs} aria-label="Переключение состояний формы">
        {screenTabs.map((tab) => (
          <button
            key={tab.screen}
            type="button"
            className={classNames(styles.devTab, screen === tab.screen && styles.devTabActive)}
            onClick={() => changeScreen(tab.screen)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {screen === "login" ? (
        <section className={styles.screen} aria-labelledby="auth-login-title">
          <h1 id="auth-login-title" className={styles.heading}>
            Добро пожаловать
          </h1>
          <p className={styles.subheading}>Войдите, чтобы продолжить генерацию карточек</p>

          <button type="button" className={styles.googleButton} onClick={handleGoogle} disabled={loadingAction !== null}>
            {loadingAction === "google" ? <Spinner /> : <GoogleIcon />}
            <span>Войти через Google</span>
          </button>

          <div className={styles.divider}>или по email</div>

          <form className={styles.form} onSubmit={handleLoginSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => handleLoginEmailChange(event.target.value)}
                autoComplete="email"
                className={classNames(styles.input, loginErrors.email && styles.inputError)}
                placeholder="you@example.com"
                aria-invalid={Boolean(loginErrors.email)}
                aria-describedby={loginErrors.email ? "login-email-error" : undefined}
              />
              {loginErrors.email ? <span id="login-email-error" className={styles.errorText}>{loginErrors.email}</span> : null}
            </label>

            <label className={styles.field}>
              <span className={styles.fieldHeader}>
                <span className={styles.label}>Пароль</span>
                <button type="button" className={styles.inlineLink} onClick={() => changeScreen("forgot")}>
                  Забыли пароль?
                </button>
              </span>
              <span className={styles.passwordWrap}>
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  value={loginPassword}
                  onChange={(event) => handleLoginPasswordChange(event.target.value)}
                  autoComplete="current-password"
                  className={classNames(styles.input, loginErrors.password && styles.inputError)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(loginErrors.password)}
                  aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setLoginPasswordVisible((value) => !value)}>
                  {loginPasswordVisible ? "Скрыть" : "Показать"}
                </button>
              </span>
              {loginErrors.password ? <span id="login-password-error" className={styles.errorText}>{loginErrors.password}</span> : null}
            </label>

            <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
              {loadingAction === "login" ? <Spinner /> : null}
              <span className={loadingAction === "login" ? styles.buttonTextLoading : undefined}>Войти</span>
            </button>
          </form>

          <p className={styles.footerText}>
            Нет аккаунта?{" "}
            <button type="button" className={styles.footerLink} onClick={() => changeScreen("register")}>
              Зарегистрироваться
            </button>
          </p>
        </section>
      ) : null}

      {screen === "register" ? (
        <section className={styles.screen} aria-labelledby="auth-register-title">
          <h1 id="auth-register-title" className={styles.heading}>
            Создать аккаунт
          </h1>
          <p className={styles.subheading}>10 карточек бесплатно, без карты</p>

          <button type="button" className={styles.googleButton} onClick={handleGoogle} disabled={loadingAction !== null}>
            {loadingAction === "google" ? <Spinner /> : <GoogleIcon />}
            <span>Зарегистрироваться через Google</span>
          </button>

          <div className={styles.divider}>или по email</div>

          <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.label}>Имя</span>
              <input
                type="text"
                value={registerName}
                onChange={(event) => handleRegisterNameChange(event.target.value)}
                autoComplete="name"
                className={classNames(styles.input, registerErrors.name && styles.inputError)}
                placeholder="Иван Иванов"
                aria-invalid={Boolean(registerErrors.name)}
                aria-describedby={registerErrors.name ? "register-name-error" : undefined}
              />
              {registerErrors.name ? <span id="register-name-error" className={styles.errorText}>{registerErrors.name}</span> : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                type="email"
                value={registerEmail}
                onChange={(event) => handleRegisterEmailChange(event.target.value)}
                autoComplete="email"
                className={classNames(styles.input, registerErrors.email && styles.inputError)}
                placeholder="you@example.com"
                aria-invalid={Boolean(registerErrors.email)}
                aria-describedby={registerErrors.email ? "register-email-error" : undefined}
              />
              {registerErrors.email ? <span id="register-email-error" className={styles.errorText}>{registerErrors.email}</span> : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Пароль</span>
              <span className={styles.passwordWrap}>
                <input
                  type={registerPasswordVisible ? "text" : "password"}
                  value={registerPassword}
                  onChange={(event) => handleRegisterPasswordChange(event.target.value)}
                  autoComplete="new-password"
                  className={classNames(styles.input, registerErrors.password && styles.inputError)}
                  placeholder="Минимум 8 символов"
                  aria-invalid={Boolean(registerErrors.password)}
                  aria-describedby={[
                    registerErrors.password ? "register-password-error" : null,
                    registerPassword ? "password-strength-text" : null,
                  ].filter(Boolean).join(" ") || undefined}
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setRegisterPasswordVisible((value) => !value)}>
                  {registerPasswordVisible ? "Скрыть" : "Показать"}
                </button>
              </span>

              {registerPassword ? (
                <span className={styles.passwordStrength}>
                  <span className={styles.passwordBars} aria-hidden="true">
                    {[1, 2, 3].map((bar) => (
                      <span
                        key={bar}
                        className={classNames(
                          styles.passwordBar,
                          passwordStrength.score >= bar && passwordStrength.tone === "weak" && styles.passwordBarWeak,
                          passwordStrength.score >= bar && passwordStrength.tone === "medium" && styles.passwordBarMedium,
                          passwordStrength.score >= bar && passwordStrength.tone === "strong" && styles.passwordBarStrong,
                        )}
                      />
                    ))}
                  </span>
                  <span
                    id="password-strength-text"
                    className={classNames(
                      styles.passwordStrengthText,
                      passwordStrength.tone === "weak" && styles.passwordStrengthWeak,
                      passwordStrength.tone === "medium" && styles.passwordStrengthMedium,
                      passwordStrength.tone === "strong" && styles.passwordStrengthStrong,
                    )}
                  >
                    {passwordStrength.label}
                  </span>
                </span>
              ) : null}

              {registerErrors.password ? <span id="register-password-error" className={styles.errorText}>{registerErrors.password}</span> : null}
            </label>

            <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
              {loadingAction === "register" ? <Spinner /> : null}
              <span className={loadingAction === "register" ? styles.buttonTextLoading : undefined}>Создать аккаунт</span>
            </button>
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
            <button type="button" className={styles.footerLink} onClick={() => changeScreen("login")}>
              Войти
            </button>
          </p>
        </section>
      ) : null}

      {screen === "forgot" ? (
        <section className={styles.screen} aria-labelledby="auth-forgot-title">
          <button type="button" className={styles.backLink} onClick={() => changeScreen("login")}>
            <ArrowLeftIcon />
            <span>Назад</span>
          </button>

          <h1 id="auth-forgot-title" className={styles.heading}>
            Забыли пароль?
          </h1>
          <p className={styles.subheading}>Введите email, и мы пришлем ссылку для сброса пароля</p>

          <form className={styles.form} onSubmit={handleForgotSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                type="email"
                value={forgotEmail}
                onChange={(event) => handleForgotEmailChange(event.target.value)}
                autoComplete="email"
                className={classNames(styles.input, forgotErrors.email && styles.inputError)}
                placeholder="you@example.com"
                aria-invalid={Boolean(forgotErrors.email)}
                aria-describedby={forgotErrors.email ? "forgot-email-error" : undefined}
              />
              {forgotErrors.email ? <span id="forgot-email-error" className={styles.errorText}>{forgotErrors.email}</span> : null}
            </label>

            <button type="submit" className={styles.submitButton} disabled={loadingAction !== null}>
              {loadingAction === "forgot" ? <Spinner /> : null}
              <span className={loadingAction === "forgot" ? styles.buttonTextLoading : undefined}>Отправить ссылку</span>
            </button>
          </form>

          <p className={styles.footerText}>
            Вспомнили пароль?{" "}
            <button type="button" className={styles.footerLink} onClick={() => changeScreen("login")}>
              Войти
            </button>
          </p>
        </section>
      ) : null}

      {screen === "forgot-sent" ? (
        <section className={styles.screen} aria-labelledby="auth-forgot-sent-title">
          <div className={styles.successIcon}>
            <CheckIcon />
          </div>
          <h1 id="auth-forgot-sent-title" className={styles.headingCentered}>
            Письмо отправлено
          </h1>
          <p className={styles.subheadingCentered}>
            Проверьте почту <strong>{sentEmail}</strong>, там будет ссылка для сброса пароля. Письмо обычно приходит в течение минуты.
          </p>

          <button type="button" className={styles.submitButton} onClick={() => changeScreen("login")}>
            Вернуться ко входу
          </button>

          <p className={styles.footerTextCompact}>
            Не пришло письмо?{" "}
            <button type="button" className={styles.footerLink} onClick={() => changeScreen("forgot")}>
              Отправить снова
            </button>
          </p>
        </section>
      ) : null}
    </div>
  );
}
