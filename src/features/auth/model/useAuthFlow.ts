"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { forgotPassword, loginAuthUser, registerAuthUser, resendRegisterAuthCode, verifyRegisterAuthUser } from "@/shared/api";
import { mapForgotErrors, mapLoginErrors, mapRegisterErrors, mapVerifyErrors } from "./mappers";
import { clearRegisterVerificationSnapshot, loadRegisterVerificationSnapshot, saveRegisterVerificationSnapshot } from "./registerVerificationStorage";
import { useCountdown } from "./useCountdown";
import type { AuthScreen, ForgotErrors, LoadingAction, LoginErrors, RegisterErrors, VerifyErrors } from "./types";
import { getPasswordStrength, getSafeNextPath, sanitizeVerificationCode, validateEmail } from "./validation";
import { useSocialAuthWidgets } from "./useSocialAuthWidgets";

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
  const [verificationId, setVerificationId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeLength, setVerificationCodeLength] = useState(6);
  const [verifyErrors, setVerifyErrors] = useState<VerifyErrors>({});
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<number | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotErrors, setForgotErrors] = useState<ForgotErrors>({});

  const passwordStrength = useMemo(() => getPasswordStrength(registerPassword), [registerPassword]);
  const resendAvailableInSeconds = useCountdown(resendAvailableAt);
  const verificationExpiresInSeconds = useCountdown(verificationExpiresAt);
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const { socialAuthError, socialAuthPending, yandexAuthUrl, vkAuthUrl } = useSocialAuthWidgets();

  useEffect(() => {
    const snapshot = loadRegisterVerificationSnapshot();
    if (!snapshot) {
      return;
    }

    setVerificationId(snapshot.verificationId);
    setVerificationEmail(snapshot.email);
    setVerificationCodeLength(snapshot.codeLength);
    setVerificationExpiresAt(snapshot.expiresAt);
    setResendAvailableAt(snapshot.resendAvailableAt);
    setScreen("register-verify");
  }, []);

  useEffect(() => {
    if (screen !== "register-verify" || !verificationId) {
      clearRegisterVerificationSnapshot();
      return;
    }

    saveRegisterVerificationSnapshot({
      email: verificationEmail,
      codeLength: verificationCodeLength,
      verificationId,
      expiresAt: verificationExpiresAt,
      resendAvailableAt,
    });
  }, [resendAvailableAt, screen, verificationCodeLength, verificationEmail, verificationExpiresAt, verificationId]);

  const changeScreen = (nextScreen: AuthScreen) => {
    setLoadingAction(null);
    setLoginErrors({});
    setRegisterErrors({});
    setVerifyErrors({});
    setForgotErrors({});
    if (nextScreen !== "register-verify") {
      setVerificationCode("");
    }
    setScreen(nextScreen);
  };

  const startVerification = (data: {
    codeLength: number;
    email: string;
    expiresInSeconds: number;
    resendAvailableInSeconds: number;
    verificationId: string;
  }) => {
    setVerificationId(data.verificationId);
    setVerificationEmail(data.email);
    setVerificationCode("");
    setVerificationCodeLength(data.codeLength);
    setVerifyErrors({});
    setResendAvailableAt(Date.now() + data.resendAvailableInSeconds * 1000);
    setVerificationExpiresAt(Date.now() + data.expiresInSeconds * 1000);
    setScreen("register-verify");
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

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(sanitizeVerificationCode(value, verificationCodeLength));
    if (verifyErrors.code || verifyErrors.form) {
      setVerifyErrors((current) => ({ ...current, code: undefined, form: undefined }));
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
    if (!validateEmail(loginEmail)) nextErrors.email = "Введите корректный email";
    if (!loginPassword) nextErrors.password = "Введите пароль";
    setLoginErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("login");
    try {
      const result = await loginAuthUser({
        body: { email: loginEmail.trim(), password: loginPassword },
      });

      if (result.error) {
        setLoginErrors(mapLoginErrors(result.error));
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
    if (!registerName.trim()) nextErrors.name = "Введите ваше имя";
    if (!validateEmail(registerEmail)) nextErrors.email = "Введите корректный email";
    if (registerPassword.length < 8) nextErrors.password = "Пароль должен быть минимум 8 символов";
    setRegisterErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("register");
    try {
      const result = await registerAuthUser({
        body: { name: registerName.trim(), email: registerEmail.trim(), password: registerPassword },
      });

      if (result.error) {
        setRegisterErrors(mapRegisterErrors(result.error));
        return;
      }

      startVerification({
        codeLength: result.data.code_length,
        email: result.data.email,
        expiresInSeconds: result.data.expires_in_seconds,
        resendAvailableInSeconds: result.data.resend_available_in_seconds,
        verificationId: result.data.verification_id,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerificationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: VerifyErrors = {};
    if (verificationCode.length !== verificationCodeLength) {
      nextErrors.code = `Введите ${verificationCodeLength}-значный код`;
    }
    setVerifyErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("verify");
    try {
      const result = await verifyRegisterAuthUser({
        body: { verification_id: verificationId, code: verificationCode },
      });

      if (result.error) {
        setVerifyErrors(mapVerifyErrors(result.error));
        return;
      }

      clearRegisterVerificationSnapshot();
      router.push(nextPath);
      router.refresh();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerificationResend = async () => {
    if (!verificationId || resendAvailableInSeconds > 0 || loadingAction !== null) {
      return;
    }

    setLoadingAction("resend");
    try {
      const result = await resendRegisterAuthCode({
        body: { verification_id: verificationId },
      });

      if (result.error) {
        setVerifyErrors(mapVerifyErrors(result.error));
        return;
      }

      setVerifyErrors({});
      setVerificationCode("");
      setResendAvailableAt(Date.now() + result.data.resend_available_in_seconds * 1000);
      setVerificationExpiresAt(Date.now() + result.data.expires_in_seconds * 1000);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: ForgotErrors = {};
    if (!validateEmail(forgotEmail)) nextErrors.email = "Введите корректный email";
    setForgotErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("forgot");
    try {
      const result = await forgotPassword({
        body: { email: forgotEmail.trim() },
      });

      if (result.error) {
        setForgotErrors(mapForgotErrors(result.error));
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
    handleVerificationCodeChange,
    handleVerificationResend,
    handleVerificationSubmit,
    loadingAction,
    loginEmail,
    loginErrors,
    loginPassword,
    loginPasswordVisible,
    passwordStrength,
    registerEmail,
    registerErrors,
    registerName,
    registerPassword,
    registerPasswordVisible,
    resendAvailableInSeconds,
    screen,
    sentEmail,
    setLoginPasswordVisible,
    setRegisterPasswordVisible,
    socialAuthError,
    socialAuthPending,
    verificationCode,
    verificationCodeLength,
    verificationEmail,
    verificationExpiresInSeconds,
    verifyErrors,
    yandexAuthUrl,
    vkAuthUrl,
  };
}
