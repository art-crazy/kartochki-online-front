"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  mapForgotApiErrors,
  mapLoginApiErrors,
  mapRegisterApiErrors,
  postAuthRequest,
} from "./api";
import type { AuthScreen, ForgotErrors, LoadingAction, LoginErrors, RegisterErrors } from "./types";
import { getPasswordStrength, getSafeNextPath, validateEmail } from "./validation";
import { useYandexAuth } from "./useYandexAuth";

export function useAuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [sentEmail, setSentEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction | null>(null);

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
  const { onYandexSdkLoad, yandexError } = useYandexAuth(screen);

  const changeScreen = (nextScreen: AuthScreen) => {
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

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  return {
    changeScreen,
    forgotEmail,
    forgotErrors,
    handleForgotEmailChange,
    handleForgotSubmit,
    handleLoginEmailChange,
    handleLoginPasswordChange,
    handleLoginSubmit,
    handleRegisterEmailChange,
    handleRegisterNameChange,
    handleRegisterPasswordChange,
    handleRegisterSubmit,
    loadingAction,
    loginEmail,
    loginErrors,
    loginPassword,
    loginPasswordVisible,
    onYandexSdkLoad,
    passwordStrength,
    registerEmail,
    registerErrors,
    registerName,
    registerPassword,
    registerPasswordVisible,
    screen,
    sentEmail,
    setLoginPasswordVisible,
    setRegisterPasswordVisible,
    yandexError,
  };
}
