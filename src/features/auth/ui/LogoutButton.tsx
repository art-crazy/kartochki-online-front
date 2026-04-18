"use client";

import { useLogout } from "@/features/auth/model/useLogout";
import { Button } from "@/shared/ui";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const { logout, isPending } = useLogout();

  return (
    <Button variant="darkOutline" size="sm" className={className} loading={isPending} onClick={() => void logout()}>
      Выйти
    </Button>
  );
}
