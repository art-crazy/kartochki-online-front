export type AuthScreen = "login" | "register" | "register-verify" | "forgot" | "forgot-sent";

export type LoadingAction = "login" | "register" | "verify" | "resend" | "forgot";

export type LoginErrors = {
  form?: string;
  email?: string;
  password?: string;
};

export type RegisterErrors = {
  form?: string;
  name?: string;
  email?: string;
  password?: string;
};

export type VerifyErrors = {
  form?: string;
  code?: string;
};

export type ForgotErrors = {
  form?: string;
  email?: string;
};
