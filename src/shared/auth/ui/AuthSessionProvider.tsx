"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import type { AuthUser } from "@/shared/api";

type AuthSessionContextValue = {
  user: AuthUser | null;
};

const AuthSessionContext = createContext<AuthSessionContextValue>({
  user: null,
});

type AuthSessionProviderProps = PropsWithChildren<{
  initialUser: AuthUser | null;
}>;

export function AuthSessionProvider({ initialUser, children }: AuthSessionProviderProps) {
  return <AuthSessionContext.Provider value={{ user: initialUser }}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}
