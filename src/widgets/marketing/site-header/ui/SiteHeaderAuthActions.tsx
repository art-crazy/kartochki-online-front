"use client";

import Link from "next/link";
import { useOptionalAuthUser } from "@/shared/auth/model/useOptionalAuthUser";
import { classNames } from "@/shared/lib/classNames";
import { getUserInitials } from "@/shared/lib/user";
import { Avatar } from "@/shared/ui/navigation/Navigation";
import { Button } from "@/shared/ui/primitives/Primitives";
import styles from "./SiteHeader.module.scss";

export function SiteHeaderAuthActions() {
  const { user, isLoading } = useOptionalAuthUser();

  if (isLoading) {
    return (
      <>
        <Button variant="outline" size="md" className={classNames(styles.secondaryAction, styles.loadingAction)} aria-hidden="true" tabIndex={-1}>
          Войти
        </Button>
        <Button variant="primary" size="md" className={classNames(styles.primaryAction, styles.loadingAction)} aria-hidden="true" tabIndex={-1}>
          Попробовать бесплатно
        </Button>
      </>
    );
  }

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

  const userName = user.name?.trim() || user.email || "Личный кабинет";
  const userInitials = getUserInitials(user.name, user.email) || "KO";

  return (
    <>
      <Link href="/app/projects" className={styles.profileLink} aria-label={`Открыть проекты пользователя: ${userName}`}>
        <Avatar initials={userInitials} src={user.avatar_url} alt={userName} size="sm" gradient={1} />
        <span className={styles.profileBody}>
          <span className={styles.profileName}>{userName}</span>
          <span className={styles.profileMeta}>Мои проекты</span>
        </span>
      </Link>
      <Button as={Link} href="/app/generate" variant="primary" size="md" className={styles.primaryAction}>
        Создать карточку
      </Button>
    </>
  );
}
