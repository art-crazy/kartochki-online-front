"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAuthUser } from "@/shared/api";

export function useLogout() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    try {
      await logoutAuthUser();
    } finally {
      router.push("/auth");
      router.refresh();
      setIsPending(false);
    }
  }

  return { logout, isPending };
}
