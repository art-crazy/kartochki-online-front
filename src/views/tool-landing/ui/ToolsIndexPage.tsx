import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { getToolsHubLinkGroups } from "@/shared/seo/internal-linking";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllToolPages } from "../model/tools";

const pages = getAllToolPages();
const breadcrumbs = buildHubBreadcrumbs("Инструменты");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Инструменты для карточек товаров",
  description: "Каталог инструментов для генерации карточек, инфографики и контента для маркетплейсов.",
  path: "/tools",
  items: pages.map((page) => ({
    label: page.hero.heading,
    href: `/tools/${page.slug}`,
  })),
});

export function ToolsIndexPage() {
  return (
    <div className={landing.page}>
      <SeoJsonLd data={collectionPageSchema} />
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs items={breadcrumbs} currentPath="/tools" />

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

        <SeoLinkSection
          eyebrow="Внутренняя перелинковка"
          title="Инструменты должны вести в страницы применения"
          intro="Use-case хаб усиливает SEO, когда связывает сценарии использования с маркетплейсами, шаблонами и смежными инструментами."
          groups={getToolsHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
