"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ErrorResponse } from "@/shared/api";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

type AuthScreen = "login" | "register" | "forgot" | "forgot-sent";

type LoginErrors = {
  form?: string;
  email?: string;
  password?: string;
};

type RegisterErrors = {
  form?: string;
  name?: string;
  email?: string;
  password?: string;
};

type ForgotErrors = {
  form?: string;
  email?: string;
};

type AuthFlowProps = {
  className?: string;
};

type YaAuthSuggestInitResult = {
  handler: () => Promise<void>;
};

type YaAuthSuggest = {
  init: (
    oauthQueryParams: Record<string, string>,
    tokenPageOrigin: string,
    suggestParams?: Record<string, string | number>,
  ) => Promise<YaAuthSuggestInitResult>;
};

declare global {
  interface Window {
    YaAuthSuggest?: YaAuthSuggest;
  }
}

const emailPattern = /\S+@\S+\.\S+/;
const yandexClientId =
  process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID ?? "e3069e26deea46b2b0da0a416a446100";

const screenTabs: ReadonlyArray<{ screen: AuthScreen; label: string }> = [
  { screen: "login", label: "Вход" },
  { screen: "register", label: "Регистрация" },
  { screen: "forgot", label: "Пароль" },
  { screen: "forgot-sent", label: "Письмо" },
];

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

  if (/\p{L}/u.test(password)) {
    score += 1;
  }

  if (/\d/.test(password) || /[^\p{L}\d]/u.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { score: 1, label: "Слабый пароль", tone: "weak" as const };
  }

  if (score === 2) {
    return { score: 2, label: "Средний пароль", tone: "medium" as const };
  }

  return { score: 3, label: "Надёжный пароль", tone: "strong" as const };
}

export function AuthFlow({ className }: AuthFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitTimeoutRef = useRef<number | null>(null);
  const yandexInitRef = useRef(false);
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [sentEmail, setSentEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<"login" | "register" | "forgot" | null>(null);
  const [yandexSdkReady, setYandexSdkReady] = useState(false);
  const [yandexError, setYandexError] = useState("");

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
  const nextPath = getSafeNextPath(searchParams.get("next"));

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!yandexSdkReady || !yandexClientId) {
      return;
    }

    if (screen !== "login" && screen !== "register") {
      return;
    }

    if (yandexInitRef.current) {
      return;
    }

    const container = document.getElementById("yandex-auth-container");
    if (!container || !window.YaAuthSuggest) {
      return;
    }

    yandexInitRef.current = true;
    container.innerHTML = "";

    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/yandex/token`;

    setYandexError("");

    window.YaAuthSuggest.init(
      {
        client_id: yandexClientId,
        response_type: "token",
        redirect_uri: redirectUri,
      },
      origin,
      {
        view: "button",
        parentId: "yandex-auth-container",
        buttonView: "main",
        buttonTheme: "light",
        buttonSize: "m",
        buttonBorderRadius: 10,
      },
    )
      .then(({ handler }) => handler())
      .catch((error) => {
        yandexInitRef.current = false;
        setYandexError("Не удалось загрузить кнопку Яндекс ID. Проверьте доступность сервиса.");
        if (process.env.NODE_ENV !== "production") {
          console.warn("Yandex ID widget init failed", error);
        }
      });
  }, [screen, yandexSdkReady]);

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

  const handleLoginEmailChange = (value: string) => {
    setLoginEmail(value);

    if (loginErrors.email || loginErrors.form) {
      setLoginErrors((current) => ({ ...current, email: undefined, form: undefined }));
    }
  };

  const handleLoginPasswordChange = (value: string) => {
    setLoginPassword(value);

    if (loginErrors.password || loginErrors.form) {
      setLoginErrors((current) => ({ ...current, password: undefined, form: undefined }));
    }
  };

  const handleRegisterNameChange = (value: string) => {
    setRegisterName(value);

    if (registerErrors.name || registerErrors.form) {
      setRegisterErrors((current) => ({ ...current, name: undefined, form: undefined }));
    }
  };

  const handleRegisterEmailChange = (value: string) => {
    setRegisterEmail(value);

    if (registerErrors.email || registerErrors.form) {
      setRegisterErrors((current) => ({ ...current, email: undefined, form: undefined }));
    }
  };

  const handleRegisterPasswordChange = (value: string) => {
    setRegisterPassword(value);

    if (registerErrors.password || registerErrors.form) {
      setRegisterErrors((current) => ({ ...current, password: undefined, form: undefined }));
    }
  };

  const handleForgotEmailChange = (value: string) => {
    setForgotEmail(value);

    if (forgotErrors.email || forgotErrors.form) {
      setForgotErrors((current) => ({ ...current, email: undefined, form: undefined }));
    }
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setLoadingAction("login");

    try {
      const result = await postAuthRequest("/api/auth/login", {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (!result.ok) {
        setLoginErrors(mapLoginApiErrors(result.error));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setLoadingAction("register");

    try {
      const result = await postAuthRequest("/api/auth/register", {
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      if (!result.ok) {
        setRegisterErrors(mapRegisterApiErrors(result.error));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleForgotSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ForgotErrors = {};

    if (!validateEmail(forgotEmail)) {
      nextErrors.email = "Введите корректный email";
    }

    setForgotErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoadingAction("forgot");

    try {
      const result = await postAuthRequest("/api/auth/forgot-password", {
        email: forgotEmail.trim(),
      });

      if (!result.ok) {
        setForgotErrors(mapForgotApiErrors(result.error));
        return;
      }

      setSentEmail(forgotEmail.trim());
      changeScreen("forgot-sent");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={classNames(styles.flow, className)}>
      <Script
        src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
        strategy="afterInteractive"
        onLoad={() => setYandexSdkReady(true)}
      />

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

          <div className={styles.socialGrid}>
            <div className={styles.yandexWidget}>
              <div id="yandex-auth-container" />
              {yandexError ? <div className={styles.oauthError}>{yandexError}</div> : null}
            </div>
            <Link href="/api/auth/vk/start" className={styles.socialButton}>
              <span className={classNames(styles.socialIcon, styles.vkIcon)}>VK</span>
              Войти через VK
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleLoginSubmit} noValidate>
            {loginErrors.form ? <div className={styles.formError}>{loginErrors.form}</div> : null}

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

          <div className={styles.socialGrid}>
            <div className={styles.yandexWidget}>
              <div id="yandex-auth-container" />
              {yandexError ? <div className={styles.oauthError}>{yandexError}</div> : null}
            </div>
            <Link href="/api/auth/vk/start" className={styles.socialButton}>
              <span className={classNames(styles.socialIcon, styles.vkIcon)}>VK</span>
              Войти через VK
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
            {registerErrors.form ? <div className={styles.formError}>{registerErrors.form}</div> : null}

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
          <p className={styles.subheading}>Введите email, и мы пришлём ссылку для сброса пароля</p>

          <form className={styles.form} onSubmit={handleForgotSubmit} noValidate>
            {forgotErrors.form ? <div className={styles.formError}>{forgotErrors.form}</div> : null}

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

type AuthRequestResult =
  | { ok: true }
  | { ok: false; error: ErrorResponse };

async function postAuthRequest(path: string, body: Record<string, unknown>): Promise<AuthRequestResult> {
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

function mapLoginApiErrors(error: ErrorResponse): LoginErrors {
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

function mapRegisterApiErrors(error: ErrorResponse): RegisterErrors {
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

function mapForgotApiErrors(error: ErrorResponse): ForgotErrors {
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

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}
