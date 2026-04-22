import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { FREE_PLAN_CTA_DESCRIPTION } from "@/shared/config/pricing";
import { buildDetailBreadcrumbs, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/shared/seo";
import { getMarketplacePageLinkGroups } from "@/shared/seo/internal-linking";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { MarketingGlowCta, SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import type { MarketplacePage } from "../model/marketplaces";
import styles from "./MarketplacePage.module.scss";

type MarketplacePageProps = {
  content: MarketplacePage;
};

export function MarketplaceLandingPage({ content }: MarketplacePageProps) {
  const currentPath = `/marketplaces/${content.slug}`;
  const breadcrumbs = buildDetailBreadcrumbs("Маркетплейсы", "/marketplaces", content.name);
  const faqSchema = buildFaqPageSchema(content.faq);
  const softwareApplicationSchema = buildSoftwareApplicationSchema({
    name: `kartochki.online для ${content.name}`,
    description: content.description,
    path: currentPath,
  });

  return (
    <div className={landing.page}>
      <SeoJsonLd data={faqSchema} />
      <SeoJsonLd data={softwareApplicationSchema} />
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs items={breadcrumbs} currentPath={currentPath} />

      <main>
        <section className={landing.hero}>
          <span className={styles.heroBadge} data-tone={content.tone}>
            {content.hero.badge}
          </span>
          <h1 className={landing.heroHeading}>{content.hero.heading}</h1>
          <p className={landing.heroSubheading}>{content.hero.subheading}</p>
          <Link href="/auth" className={landing.heroCta}>
            {content.hero.ctaLabel}
          </Link>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>{content.requirements.title}</h2>
            <ul className={styles.requirementsList}>
              {content.requirements.items.map((item) => (
                <li key={item} className={styles.requirementsItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Что умеет генератор для {content.nameGenitive}</h2>
            <div className={landing.featuresGrid}>
              {content.features.map((feature) => (
                <div key={feature.title} className={landing.featureCard}>
                  <div className={landing.featureIcon}>{feature.icon}</div>
                  <h3 className={landing.featureTitle}>{feature.title}</h3>
                  <p className={landing.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Частые вопросы</h2>
            <div className={landing.faqList}>
              {content.faq.map((item) => (
                <div key={item.question} className={landing.faqItem}>
                  <h3 className={landing.faqQuestion}>{item.question}</h3>
                  <p className={landing.faqAnswer}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SeoLinkSection
          eyebrow="Связанные разделы"
          title={`Что ещё помогает продавцам на ${content.name}`}
          intro="Коммерческая страница маркетплейса должна передавать вес дальше: в инструменты, шаблоны и смежные материалы по этому интенту."
          groups={getMarketplacePageLinkGroups(content.slug)}
        />

        <MarketingGlowCta
          title={<>Создайте первые карточки для {content.nameGenitive} бесплатно</>}
          description={FREE_PLAN_CTA_DESCRIPTION}
          buttonLabel={content.hero.ctaLabel}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
