import Link from "next/link";
import { Button } from "@/shared/ui/primitives/Primitives";
import styles from "./HomeHeader.module.scss";

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <ul className={styles.navLinks}>
            <li>
              <a href="#how">Как работает</a>
            </li>
            <li>
              <a href="#platforms">Площадки</a>
            </li>
            <li>
              <a href="#features">Возможности</a>
            </li>
            <li>
              <a href="#pricing">Тарифы</a>
            </li>
            <li>
              <a href="#blog">Блог</a>
            </li>
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
