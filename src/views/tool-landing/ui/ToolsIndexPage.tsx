import Link from "next/link";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SeoBreadcrumbs } from "@/shared/ui";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllToolPages } from "../model/tools";

const pages = getAllToolPages();

export function ToolsIndexPage() {
  return (
    <div className={landing.page}>
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Инструменты" }]}
        currentPath="/tools"
      />

      <main>
        <section className={landing.hero}>
          <h1 className={landing.heroHeading}>Инструменты для карточек товаров и контента</h1>
          <p className={landing.heroSubheading}>
            Подберите подходящий инструмент для генерации карточек, инфографики и других материалов для
            маркетплейсов. Каждая страница раскрывает сценарий применения и возможности сервиса.
          </p>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <div className={styles.grid}>
              {pages.map((page) => (
                <Link key={page.slug} href={`/tools/${page.slug}`} className={styles.card}>
                  <span className={styles.cardBadge}>Инструмент</span>
                  <h2 className={styles.cardTitle}>{page.hero.heading}</h2>
                  <p className={styles.cardDescription}>{page.description}</p>
                  <span className={styles.cardCta}>Перейти к описанию -&gt;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
