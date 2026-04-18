"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAuthTransition() {
  const queryClient = useQueryClient();
  const router = useRouter();

  function completeLogin(nextPath: string) {
    queryClient.clear();
    router.replace(nextPath);
    router.refresh();
  }

  function completeLogout() {
    queryClient.clear();
    router.push("/auth");
    router.refresh();
  }

  return { completeLogin, completeLogout };
}
