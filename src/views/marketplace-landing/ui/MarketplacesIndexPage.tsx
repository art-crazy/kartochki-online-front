import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { getMarketplacesHubLinkGroups } from "@/shared/seo";
import { SeoBreadcrumbs, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import { getAllMarketplacePages } from "../model/marketplaces";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";

const pages = getAllMarketplacePages();

export function MarketplacesIndexPage() {
  return (
    <div className={landing.page}>
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Маркетплейсы" }]}
        currentPath="/marketplaces"
      />

      <main>
        <section className={landing.hero}>
          <h1 className={landing.heroHeading}>Карточки товаров для каждого маркетплейса</h1>
          <p className={landing.heroSubheading}>
            Выберите площадку: сервис автоматически применит правильные размеры, фон и требования к
            инфографике под Wildberries, Ozon или Яндекс Маркет.
          </p>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <div className={styles.grid}>
              {pages.map((page) => (
                <Link key={page.slug} href={`/marketplaces/${page.slug}`} className={styles.card}>
                  <span className={styles.cardBadge} data-tone={page.tone}>
                    {page.hero.badge}
                  </span>
                  <h2 className={styles.cardTitle}>{page.name}</h2>
                  <p className={styles.cardDescription}>{page.description}</p>
                  <span className={styles.cardCta}>Подробнее -&gt;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <SeoLinkSection
          eyebrow="Внутренняя перелинковка"
          title="Смежные разделы для подготовки карточек"
          intro="Хаб маркетплейсов должен распределять вес дальше: в страницы площадок, инструменты и шаблоны под конкретные категории."
          groups={getMarketplacesHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
