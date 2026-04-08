import type { MarketingLink } from "@/shared/config/marketing";
import Link from "next/link";
import styles from "./SiteFooter.module.scss";

type SiteFooterProps = {
  links: readonly MarketingLink[];
};

export function SiteFooter({ links }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.logo}>
            карточки<span>.</span>онлайн
          </Link>

          <ul className={styles.footerLinks}>
            {links.map((link) => (
              <li key={`${link.label}-${link.href ?? "static"}`}>
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

          <p className={styles.footerCopy}>© 2026 kartochki.online</p>
        </div>
      </div>
    </footer>
  );
}
