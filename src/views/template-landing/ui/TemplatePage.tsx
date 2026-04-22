import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { FREE_PLAN_CTA_DESCRIPTION } from "@/shared/config/pricing";
import { buildDetailBreadcrumbs, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/shared/seo";
import { getTemplatePageLinkGroups } from "@/shared/seo/internal-linking";
import { MarketingGlowCta, SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import type { TemplatePage } from "../model/templates";
import styles from "./TemplatePage.module.scss";

type TemplatePageProps = {
  content: TemplatePage;
};

export function TemplateLandingPage({ content }: TemplatePageProps) {
  const currentPath = `/templates/${content.slug}`;
  const breadcrumbs = buildDetailBreadcrumbs("Шаблоны", "/templates", content.categoryName);
  const faqSchema = buildFaqPageSchema(content.faq);
  const softwareApplicationSchema = buildSoftwareApplicationSchema({
    name: `Шаблон карточки: ${content.categoryName}`,
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
            <h2 className={landing.sectionTitle}>Структура карточки</h2>
            <div className={styles.slidesList}>
              {content.slides.map((slide, index) => (
                <div key={slide.label} className={styles.slideItem}>
                  <div className={styles.slideNumber}>{String(index + 1).padStart(2, "0")}</div>
                  <div className={styles.slideContent}>
                    <h3 className={styles.slideLabel}>{slide.label}</h3>
                    <p className={styles.slideDescription}>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Для каких товаров подходит</h2>
            <ul className={styles.useCasesList}>
              {content.useCases.map((item) => (
                <li key={item} className={styles.useCaseItem}>
                  {item}
                </li>
              ))}
            </ul>
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
          eyebrow="Связанные шаблоны"
          title={`Куда перейти после шаблона «${content.categoryName}»`}
          intro="После выбора шаблона обычно полезно посмотреть страницы по маркетплейсам, смежные категории и инструменты, которые помогают собрать финальную карточку товара."
          groups={getTemplatePageLinkGroups(content.slug)}
        />

        <MarketingGlowCta
          title="Создайте карточку по шаблону бесплатно"
          description={FREE_PLAN_CTA_DESCRIPTION}
          buttonLabel={content.hero.ctaLabel}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
