import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { getTemplatesHubLinkGroups } from "@/shared/seo/internal-linking";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllTemplatePages } from "../model/templates";

const pages = getAllTemplatePages();
const breadcrumbs = buildHubBreadcrumbs("Шаблоны");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Шаблоны карточек товаров",
  description: "Каталог шаблонов карточек товаров по категориям для маркетплейсов.",
  path: "/templates",
  items: pages.map((page) => ({
    label: page.categoryName,
    href: `/templates/${page.slug}`,
  })),
});

export function TemplatesIndexPage() {
  return (
    <div className={landing.page}>
      <SeoJsonLd data={collectionPageSchema} />
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs items={breadcrumbs} currentPath="/templates" />

      <main>
        <section className={landing.hero}>
          <h1 className={landing.heroHeading}>Шаблоны карточек товаров по категориям</h1>
          <p className={landing.heroSubheading}>
            Готовые структуры карточек для одежды, электроники, косметики и товаров для дома. Выберите категорию
            и откройте подходящий шаблон под маркетплейсы.
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

        <SeoLinkSection
          eyebrow="Внутренняя перелинковка"
          title="Шаблоны связаны с площадками и инструментами"
          intro="Категорийный хаб должен вести не только в шаблоны, но и в marketplace pages и feature pages, которые закрывают следующий шаг."
          groups={getTemplatesHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
