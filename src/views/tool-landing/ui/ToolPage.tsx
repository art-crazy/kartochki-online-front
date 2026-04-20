import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { buildDetailBreadcrumbs, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/shared/seo";
import { getToolPageLinkGroups } from "@/shared/seo/internal-linking";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import type { ToolPage } from "../model/tools";
import styles from "./ToolPage.module.scss";

type ToolPageProps = {
  content: ToolPage;
};

export function ToolLandingPage({ content }: ToolPageProps) {
  const currentPath = `/tools/${content.slug}`;
  const breadcrumbs = buildDetailBreadcrumbs("Инструменты", "/tools", content.hero.heading);
  const faqSchema = buildFaqPageSchema(content.faq);
  const softwareApplicationSchema = buildSoftwareApplicationSchema({
    name: content.hero.heading,
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
          <h1 className={landing.heroHeading}>{content.hero.heading}</h1>
          <p className={landing.heroSubheading}>{content.hero.subheading}</p>
          <Link href="/auth" className={landing.heroCta}>
            {content.hero.ctaLabel}
          </Link>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Как это работает</h2>
            <div className={styles.stepsList}>
              {content.howItWorks.map((item) => (
                <div key={item.step} className={styles.step}>
                  <div className={styles.stepNumber}>{item.step}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{item.title}</h3>
                    <p className={styles.stepDescription}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Возможности</h2>
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
          eyebrow="Следующий шаг"
          title="Где использовать этот инструмент дальше"
          intro="Feature page должна вести в более конкретные страницы применения: маркетплейсы, подходящие шаблоны и соседние коммерческие разделы."
          groups={getToolPageLinkGroups(content.slug)}
        />

        <section className={landing.ctaSection}>
          <div className={landing.container}>
            <h2 className={landing.ctaTitle}>Попробуйте бесплатно</h2>
            <p className={landing.ctaSubtitle}>
              10 карточек в месяц без оплаты. Регистрация занимает 30 секунд.
            </p>
            <Link href="/auth" className={landing.ctaButton}>
              {content.hero.ctaLabel}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
