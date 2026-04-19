import Link from "next/link";
import { marketingHeaderNav, marketingFooterColumns } from "@/shared/config/marketing";
import { getMarketplacePageLinkGroups } from "@/shared/seo";
import landing from "@/shared/ui/landing/LandingPage.module.scss";
import { SeoBreadcrumbs, SeoLinkSection } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import type { MarketplacePage } from "../model/marketplaces";
import styles from "./MarketplacePage.module.scss";

type MarketplacePageProps = {
  content: MarketplacePage;
};

export function MarketplaceLandingPage({ content }: MarketplacePageProps) {
  return (
    <div className={landing.page}>
      <SiteHeader nav={marketingHeaderNav} />
      <SeoBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Маркетплейсы", href: "/marketplaces" },
          { label: content.name },
        ]}
        currentPath={`/marketplaces/${content.slug}`}
      />

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

        <section className={landing.ctaSection}>
          <div className={landing.container}>
            <h2 className={landing.ctaTitle}>Создайте первые карточки для {content.nameGenitive} бесплатно</h2>
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
