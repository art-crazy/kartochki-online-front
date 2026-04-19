import type { FooterColumn } from "@/shared/config/marketing";
import Link from "next/link";
import styles from "./SiteFooter.module.scss";

type SiteFooterProps = {
  columns: readonly FooterColumn[];
};

export function SiteFooter({ columns }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <nav className={styles.columns} aria-label="Навигация по разделам">
            {columns.map((col) => (
              <div key={col.heading} className={styles.column}>
                <div className={styles.columnHeading}>{col.heading}</div>
                <ul className={styles.columnLinks}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {!link.href ? (
                        <span className={styles.footerText}>{link.label}</span>
                      ) : link.href.startsWith("mailto:") ? (
                        <a href={link.href}>{link.label}</a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className={styles.footerCopy}>© 2026 kartochki.online</p>
      </div>
    </footer>
  );
}
