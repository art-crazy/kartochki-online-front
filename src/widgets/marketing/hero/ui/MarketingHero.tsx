import { siteConfig } from "@/shared/config/site";
import styles from "./MarketingHero.module.scss";

export function MarketingHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.brand}>{siteConfig.name}</div>
      <p className={styles.kicker}>SEO-first генератор карточек товаров</p>
      <h1 className={styles.title}>
        Создавайте товарные карточки и продающие изображения для маркетплейсов
        быстрее.
      </h1>
      <p className={styles.description}>
        База проекта готова для переноса вашего HTML-kit в FSD-структуру на
        Next.js.
      </p>
    </section>
  );
}
