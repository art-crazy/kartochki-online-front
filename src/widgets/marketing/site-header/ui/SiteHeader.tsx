import type { MarketingLink } from "@/shared/config/marketing";
import Link from "next/link";
import { Button } from "@/shared/ui/primitives/Primitives";
import styles from "./SiteHeader.module.scss";

type SiteHeaderLink = MarketingLink & {
  href: string;
};

type SiteHeaderProps = {
  links: readonly SiteHeaderLink[];
};

export function SiteHeader({ links }: SiteHeaderProps) {
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
            <Button as={Link} href="/auth" variant="outline" size="md">
              Войти
            </Button>
            <Button as={Link} href="/auth" variant="primary" size="md">
              Попробовать бесплатно
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
