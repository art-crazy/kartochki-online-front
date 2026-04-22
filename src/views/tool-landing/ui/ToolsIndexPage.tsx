import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { getToolsHubLinkGroups } from "@/shared/seo/internal-linking";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllToolPages } from "../model/tools";

const pages = getAllToolPages();
const breadcrumbs = buildHubBreadcrumbs("Инструменты");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Инструменты для карточек товаров",
  description: "Каталог инструментов для создания карточек товаров, инфографики и визуального контента для маркетплейсов.",
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
          <h1 className={landing.heroHeading}>Инструменты для карточек товаров и инфографики</h1>
          <p className={landing.heroSubheading}>
            Здесь собраны инструменты, которые помогают быстрее готовить продающий контент для маркетплейсов: от
            генерации карточек товара до сборки инфографики. Выберите сценарий, который ближе вашей задаче, и
            перейдите к детальной странице с примерами применения.
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
          eyebrow="Полезные переходы"
          title="Где эти инструменты пригодятся дальше"
          intro="После выбора инструмента пользователю обычно нужен следующий шаг: посмотреть страницы по маркетплейсам, подобрать шаблон категории и перейти в смежные сценарии."
          groups={getToolsHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
