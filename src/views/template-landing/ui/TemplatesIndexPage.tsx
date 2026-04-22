import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { getTemplatesHubLinkGroups } from "@/shared/seo/internal-linking";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import styles from "@/shared/ui/landing/LandingIndex.module.scss";
import { getAllTemplatePages } from "../model/templates";

const pages = getAllTemplatePages();
const breadcrumbs = buildHubBreadcrumbs("Шаблоны");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Шаблоны карточек товаров",
  description: "Каталог шаблонов карточек товаров по категориям для маркетплейсов: одежда, электроника, косметика и товары для дома.",
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
            Готовые структуры карточек для популярных товарных категорий помогают быстрее оформить обложку,
            дополнительные слайды и инфографику без хаотичной ручной сборки. Выберите категорию и возьмите за основу
            шаблон, который ближе к вашему ассортименту.
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
          eyebrow="Полезные переходы"
          title="Смежные разделы для подготовки карточки"
          intro="После выбора шаблона обычно нужно посмотреть страницу нужного маркетплейса, подобрать инструмент и перейти в близкие по смыслу категории."
          groups={getTemplatesHubLinkGroups()}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
