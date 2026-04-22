import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { getMarketplacesHubLinkGroups } from "@/shared/seo/internal-linking";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import { getAllMarketplacePages } from "../model/marketplaces";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";

const pages = getAllMarketplacePages();
const breadcrumbs = buildHubBreadcrumbs("Маркетплейсы");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Карточки товаров для маркетплейсов",
  description: "Страницы по маркетплейсам: Wildberries, Ozon и Яндекс Маркет с рекомендациями по созданию карточек товаров.",
  path: "/marketplaces",
  items: pages.map((page) => ({
    label: page.name,
    href: `/marketplaces/${page.slug}`,
  })),
});

export function MarketplacesIndexPage() {
  return (
    <div className={landing.page}>
      <SeoJsonLd data={collectionPageSchema} />
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs items={breadcrumbs} currentPath="/marketplaces" />

      <main>
        <section className={landing.hero}>
          <h1 className={landing.heroHeading}>Карточки товаров под Wildberries, Ozon и Яндекс Маркет</h1>
          <p className={landing.heroSubheading}>
            Выберите площадку и посмотрите, как лучше оформить карточку товара именно под ее выдачу, аудиторию и
            формат контента. Это помогает быстрее запускать новые позиции, повышать качество карточек и не делать
            один и тот же визуал вслепую под все маркетплейсы сразу.
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
          eyebrow="Полезные разделы"
          title="Что еще поможет подготовить карточки товаров"
          intro="После выбора маркетплейса обычно нужен следующий шаг: подобрать инструмент, найти подходящий шаблон категории и посмотреть смежные страницы по задаче."
          groups={getMarketplacesHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
