import Link from "next/link";
import { marketingFooterColumns, marketingHeaderNav } from "@/shared/config/marketing";
import { buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/shared/seo";
import { getMarketplaceTemplatePageLinkGroups } from "@/shared/seo/internal-linking-marketplace-templates";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { MarketingGlowCta, SeoBreadcrumbs, SeoJsonLd, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import type { MarketplaceTemplateLanding } from "../model/solutions";
import { buildMarketplaceTemplateHref } from "../model/solutions";
import styles from "./MarketplaceTemplatePage.module.scss";

type MarketplaceTemplatePageProps = {
  content: MarketplaceTemplateLanding;
};

export function MarketplaceTemplatePage({ content }: MarketplaceTemplatePageProps) {
  const currentPath = buildMarketplaceTemplateHref(content.marketplaceSlug, content.templateSlug);
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Маркетплейсы", href: "/marketplaces" },
    { label: content.marketplaceName, href: `/marketplaces/${content.marketplaceSlug}` },
    { label: content.templateName },
  ];
  const faqSchema = buildFaqPageSchema(content.faq);
  const softwareApplicationSchema = buildSoftwareApplicationSchema({
    name: `Шаблон карточки ${content.templateName.toLowerCase()} для ${content.marketplaceName}`,
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
            <h2 className={landing.sectionTitle}>{content.sections.title}</h2>
            <div className={styles.slidesList}>
              {content.sections.items.map((item, index) => (
                <div key={item.label} className={styles.slideItem}>
                  <div className={styles.slideNumber}>{String(index + 1).padStart(2, "0")}</div>
                  <div className={styles.slideContent}>
                    <h3 className={styles.slideLabel}>{item.label}</h3>
                    <p className={styles.slideDescription}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>{content.useCases.title}</h2>
            <ul className={styles.useCasesList}>
              {content.useCases.items.map((item) => (
                <li key={item} className={styles.useCaseItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={landing.section}>
          <div className={landing.container}>
            <h2 className={landing.sectionTitle}>Частые вопросы продавцов</h2>
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
          eyebrow="Полезные сценарии"
          title={`Что ещё посмотреть продавцу на ${content.marketplaceName} рядом с шаблоном ${content.templateName.toLowerCase()}`}
          intro="Обычно одной категории недостаточно. Рядом полезно смотреть соседние шаблоны и инструменты, чтобы быстрее собрать карточку под весь ассортимент, а не только под один товар."
          groups={getMarketplaceTemplatePageLinkGroups(content.marketplaceSlug, content.templateSlug)}
        />

        <MarketingGlowCta
          title={`Соберите карточку ${content.templateName.toLowerCase()} без долгой ручной сборки`}
          description={`Используйте готовую структуру для ${content.templateName.toLowerCase()} и адаптируйте её под ${content.marketplaceName}, чтобы быстрее запустить товар, обновить карточку или масштабировать контент на линейку SKU.`}
          buttonLabel={content.hero.ctaLabel}
        />
      </main>

      <SiteFooter columns={marketingFooterColumns} />
    </div>
  );
}
