export type AuthScreen = "login" | "register" | "forgot" | "forgot-sent";

export type LoadingAction = "login" | "register" | "forgot";

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

export type ForgotErrors = {
  form?: string;
  email?: string;
};
