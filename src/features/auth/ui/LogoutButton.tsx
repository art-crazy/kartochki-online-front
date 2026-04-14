"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAuthUser } from "@/shared/api";
import { Button } from "@/shared/ui";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await logoutAuthUser();
    } finally {
      router.push("/auth");
      router.refresh();
      setIsPending(false);
    }
  }

  return (
    <Button variant="darkOutline" size="sm" className={className} loading={isPending} onClick={() => void handleLogout()}>
      Выйти
    </Button>
  );
}
