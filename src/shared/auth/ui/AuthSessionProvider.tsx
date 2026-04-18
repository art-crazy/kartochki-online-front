"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, type PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { type AuthUser } from "@/shared/api";
import { getCurrentUserQueryOptions } from "@/shared/auth/model/getCurrentUserQueryOptions";

type AuthSessionContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
};

const AuthSessionContext = createContext<AuthSessionContextValue>({
  user: null,
  isLoading: true,
});

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(getCurrentUserQueryOptions());

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/auth");
    }
  }, [isLoading, isError, router]);

  return (
    <AuthSessionContext.Provider value={{ user: data?.user ?? null, isLoading }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}
