import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { authPreviewCards } from "../model/content";
import styles from "./AuthPage.module.scss";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.heroPanel} aria-label="Преимущества сервиса">
          <Link href="/" className={styles.logo}>
            РєР°СЂС‚РѕС‡РєРё<span>.</span>РѕРЅР»Р°Р№РЅ
          </Link>

          <div className={styles.heroContent}>
            <h2 className={styles.title}>
              РљР°СЂС‚РѕС‡РєРё С‚РѕРІР°СЂРѕРІ
              <br />
              РґР»СЏ WB Рё Ozon
              <br />
              <em>Р·Р° 30 СЃРµРєСѓРЅРґ</em>
            </h2>

            <div className={styles.previewGrid}>
              {authPreviewCards.map((card) => (
                <article
                  key={card.label}
                  className={classNames(styles.previewCard, styles[card.className])}
                  aria-label={card.label}
                >
                  <div className={styles.previewShimmer} />
                  <span className={styles.previewLabel}>{card.label}</span>
                </article>
              ))}
            </div>
          </div>

          <p className={styles.footer}>© {currentYear} kartochki-online.ru</p>
        </section>

        <section className={styles.formPanel}>{children}</section>
      </div>
    </main>
  );
}
