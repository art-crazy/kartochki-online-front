import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/shared/seo";
import { getMarketplaceToolPageLinkGroups } from "@/shared/seo/internal-linking-marketplace-tools";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { MarketingGlowCta, SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import type { MarketplaceToolLanding } from "../model/solutions";
import { buildMarketplaceToolHref } from "../model/solutions";
import styles from "./MarketplaceToolPage.module.scss";

type MarketplaceToolPageProps = {
  content: MarketplaceToolLanding;
};

export function MarketplaceToolPage({ content }: MarketplaceToolPageProps) {
  const currentPath = buildMarketplaceToolHref(content.marketplaceSlug, content.toolSlug);
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Маркетплейсы", href: "/marketplaces" },
    { label: content.marketplaceName, href: `/marketplaces/${content.marketplaceSlug}` },
    { label: content.toolName },
  ];
  const faqSchema = buildFaqPageSchema(content.faq);
  const softwareApplicationSchema = buildSoftwareApplicationSchema({
    name: `${content.toolName} для ${content.marketplaceName}`,
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
            <h2 className={landing.sectionTitle}>Как использовать сценарий</h2>
            <div className={styles.stepsList}>
              {content.steps.map((step) => (
                <div key={step.step} className={styles.step}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Почему этот сценарий работает</h2>
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
          eyebrow="Глубокая перелинковка"
          title={`Куда вести пользователя после страницы ${content.toolName.toLowerCase()} для ${content.marketplaceName}`}
          intro="Эта страница не должна быть тупиком: она передаёт вес соседним сценариям, основным хабам и релевантным коммерческим разделам."
          groups={getMarketplaceToolPageLinkGroups(content.marketplaceSlug, content.toolSlug)}
        />

        <MarketingGlowCta
          title="Запустите этот сценарий бесплатно"
          description={`10 карточек в месяц без оплаты. Начните с площадки ${content.marketplaceName} и протестируйте результат на реальном товаре.`}
          buttonLabel={content.hero.ctaLabel}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
