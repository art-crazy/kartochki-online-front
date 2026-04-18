import Link from "next/link";
import type { AuthUser } from "@/shared/api";
import { Button } from "@/shared/ui/primitives/Primitives";
import { SiteHeaderUserMenu } from "./SiteHeaderUserMenu";
import styles from "./SiteHeader.module.scss";

type SiteHeaderAuthActionsProps = {
  user: AuthUser | null;
};

export function SiteHeaderAuthActions({ user }: SiteHeaderAuthActionsProps) {
  if (!user) {
    return (
      <>
        <Button as={Link} href="/auth" variant="outline" size="md" className={styles.secondaryAction}>
          Войти
        </Button>
        <Button as={Link} href="/auth" variant="primary" size="md" className={styles.primaryAction}>
          Попробовать бесплатно
        </Button>
      </>
    );
  }

  return (
    <>
      <SiteHeaderUserMenu user={user} />
      <Button as={Link} href="/app/generate" variant="primary" size="md" className={styles.primaryAction}>
        Создать карточку
      </Button>
    </>
  );
}
