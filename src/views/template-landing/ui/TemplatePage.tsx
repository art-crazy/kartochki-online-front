import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import {
  buildDetailBreadcrumbs,
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  getTemplatePageLinkGroups,
} from "@/shared/seo";
import { SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
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
          intro="Template page должна передавать вес в смежные шаблоны, marketplace pages и инструменты, которые помогают собрать финальную карточку."
          groups={getTemplatePageLinkGroups(content.slug)}
        />

        <section className={landing.ctaSection}>
          <div className={landing.container}>
            <h2 className={landing.ctaTitle}>Создайте карточку по шаблону бесплатно</h2>
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
