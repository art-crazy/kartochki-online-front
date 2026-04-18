"use client";

import { useState } from "react";
import { logoutAuthUser } from "@/shared/api";
import { useAuthTransition } from "@/shared/auth/model/useAuthTransition";

export function useLogout() {
  const { completeLogout } = useAuthTransition();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    try {
      await logoutAuthUser();
    } finally {
      completeLogout();
      setIsPending(false);
    }
  }

  return { logout, isPending };
}
