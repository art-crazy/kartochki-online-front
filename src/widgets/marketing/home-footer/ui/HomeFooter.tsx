import Link from "next/link";
import styles from "./HomeFooter.module.scss";

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <ul className={styles.footerLinks}>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#pricing">Тарифы</a>
            </li>
            <li>
              <a href="#blog">Блог</a>
            </li>
            <li>
              <a href="mailto:support@kartochki-online.ru">Поддержка</a>
            </li>
          </ul>

          <p className={styles.footerCopy}>© 2026 kartochki.online</p>
        </div>
      </div>
    </footer>
  );
}
