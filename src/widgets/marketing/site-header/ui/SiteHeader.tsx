import type { NavItem } from "@/shared/config/marketing";
import { getOptionalServerAuthUser } from "@/shared/auth/model/getOptionalServerAuthUser";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { SiteHeaderAuthActions } from "./SiteHeaderAuthActions";
import styles from "./SiteHeader.module.scss";

type SiteHeaderProps = {
  nav: readonly NavItem[];
};

export async function SiteHeader({ nav }: SiteHeaderProps) {
  const user = await getOptionalServerAuthUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <NavLinks nav={nav} />

          <div className={styles.navActions}>
            <SiteHeaderAuthActions user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}
