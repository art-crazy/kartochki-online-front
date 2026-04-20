import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildCollectionPageSchema, buildHubBreadcrumbs } from "@/shared/seo";
import { SeoBreadcrumbs, SeoJsonLd } from "@/shared/ui";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import { getSiteMapSections } from "../model/siteMap";
import styles from "./SiteMapPage.module.scss";

const sections = getSiteMapSections();
const breadcrumbs = buildHubBreadcrumbs("Карта сайта");
const collectionPageSchema = buildCollectionPageSchema({
  name: "Карта сайта kartochki.online",
  description: "Навигация по основным SEO-разделам, посадочным страницам и статьям блога.",
  path: "/sitemap",
  items: sections.flatMap((section) =>
    section.links.map((link) => ({
      label: link.label,
      href: link.href,
    })),
  ),
});

export function SiteMapPage() {
  return (
    <div className={landing.page}>
      <SeoJsonLd data={collectionPageSchema} />
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs items={breadcrumbs} currentPath="/sitemap" />

      <main>
        <section className={landing.hero}>
          <div className={styles.intro}>
            <h1 className={landing.heroHeading}>Карта сайта</h1>
            <p className={landing.heroSubheading}>
              Единая точка входа в коммерческие страницы, категорийные хабы и статьи блога. Эта страница усиливает
              навигацию для пользователей и делает структуру сайта более явной для поисковых систем.
            </p>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <div className={styles.sections}>
              {sections.map((section) => (
                <section key={section.title} className={styles.sectionCard} aria-labelledby={section.title}>
                  <header className={styles.sectionHeader}>
                    <h2 id={section.title} className={styles.sectionTitle}>
                      {section.title}
                    </h2>
                    <p className={styles.sectionSummary}>{section.summary}</p>
                  </header>

                  <div className={styles.linkGrid}>
                    {section.links.map((link) => (
                      <Link key={link.href} href={link.href} className={styles.linkCard}>
                        <span className={styles.linkLabel}>{link.label}</span>
                        <p className={styles.linkDescription}>{link.description}</p>
                        <span className={styles.linkArrow}>Перейти -&gt;</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
