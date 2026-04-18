import type { MarketingLink } from "@/shared/config/marketing";
import { getOptionalServerAuthUser } from "@/shared/auth/model/getOptionalServerAuthUser";
import Link from "next/link";
import { SiteHeaderAuthActions } from "./SiteHeaderAuthActions";
import styles from "./SiteHeader.module.scss";

type SiteHeaderLink = MarketingLink & {
  href: string;
};

type SiteHeaderProps = {
  links: readonly SiteHeaderLink[];
};

export async function SiteHeader({ links }: SiteHeaderProps) {
  const user = await getOptionalServerAuthUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <ul className={styles.navLinks}>
            {links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <SiteHeaderAuthActions user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}
