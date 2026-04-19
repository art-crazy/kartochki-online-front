import Link from "next/link";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SeoBreadcrumbs } from "@/shared/ui";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllTemplatePages } from "../model/templates";

const pages = getAllTemplatePages();

export function TemplatesIndexPage() {
  return (
    <div className={landing.page}>
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Шаблоны" }]}
        currentPath="/templates"
      />

      <main>
        <section className={landing.hero}>
          <h1 className={landing.heroHeading}>Шаблоны карточек товаров по категориям</h1>
          <p className={landing.heroSubheading}>
            Готовые структуры карточек для одежды, электроники, косметики и товаров для дома. Выберите
            категорию и откройте подходящий шаблон под маркетплейсы.
          </p>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <div className={styles.grid}>
              {pages.map((page) => (
                <Link key={page.slug} href={`/templates/${page.slug}`} className={styles.card}>
                  <span className={styles.cardBadge}>Категория</span>
                  <h2 className={styles.cardTitle}>{page.categoryName}</h2>
                  <p className={styles.cardDescription}>{page.description}</p>
                  <span className={styles.cardCta}>Открыть шаблон -&gt;</span>
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
