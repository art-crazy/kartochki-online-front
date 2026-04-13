"use client";

import Script from "next/script";
import { classNames } from "@/shared/lib/classNames";
import { useAuthFlow } from "../model/useAuthFlow";
import { AuthDevTabs } from "./AuthDevTabs";
import styles from "./AuthFlow.module.scss";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { ForgotSentScreen } from "./ForgotSentScreen";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";

type AuthFlowProps = {
  className?: string;
};

export function AuthFlow({ className }: AuthFlowProps) {
  const authFlow = useAuthFlow();

  return (
    <div className={classNames(styles.flow, className)}>
      <Script
        src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
        strategy="afterInteractive"
        onLoad={authFlow.onYandexSdkLoad}
      />

      <AuthDevTabs activeScreen={authFlow.screen} onChange={authFlow.changeScreen} />

      {authFlow.screen === "login" ? (
        <LoginScreen
          email={authFlow.loginEmail}
          errors={authFlow.loginErrors}
          loadingAction={authFlow.loadingAction}
          onEmailChange={authFlow.handleLoginEmailChange}
          onForgotClick={() => authFlow.changeScreen("forgot")}
          onPasswordChange={authFlow.handleLoginPasswordChange}
          onRegisterClick={() => authFlow.changeScreen("register")}
          onSubmit={authFlow.handleLoginSubmit}
          password={authFlow.loginPassword}
          passwordVisible={authFlow.loginPasswordVisible}
          setPasswordVisible={authFlow.setLoginPasswordVisible}
          yandexError={authFlow.yandexError}
        />
      ) : null}

      {authFlow.screen === "register" ? (
        <RegisterScreen
          email={authFlow.registerEmail}
          errors={authFlow.registerErrors}
          loadingAction={authFlow.loadingAction}
          name={authFlow.registerName}
          onEmailChange={authFlow.handleRegisterEmailChange}
          onLoginClick={() => authFlow.changeScreen("login")}
          onNameChange={authFlow.handleRegisterNameChange}
          onPasswordChange={authFlow.handleRegisterPasswordChange}
          onSubmit={authFlow.handleRegisterSubmit}
          password={authFlow.registerPassword}
          passwordStrength={authFlow.passwordStrength}
          passwordVisible={authFlow.registerPasswordVisible}
          setPasswordVisible={authFlow.setRegisterPasswordVisible}
          yandexError={authFlow.yandexError}
        />
      ) : null}

      {authFlow.screen === "forgot" ? (
        <ForgotPasswordScreen
          email={authFlow.forgotEmail}
          errors={authFlow.forgotErrors}
          loadingAction={authFlow.loadingAction}
          onEmailChange={authFlow.handleForgotEmailChange}
          onLoginClick={() => authFlow.changeScreen("login")}
          onSubmit={authFlow.handleForgotSubmit}
        />
      ) : null}

      {authFlow.screen === "forgot-sent" ? (
        <ForgotSentScreen
          onForgotClick={() => authFlow.changeScreen("forgot")}
          onLoginClick={() => authFlow.changeScreen("login")}
          sentEmail={authFlow.sentEmail}
        />
      ) : null}
    </div>
  );
}
