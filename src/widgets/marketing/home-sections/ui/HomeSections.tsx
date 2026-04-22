import type { ReactNode } from "react";
import Link from "next/link";
import { Avatar } from "@/shared/ui/navigation/Navigation";
import { Accordion } from "@/shared/ui/feedback/Accordion";
import { BlogCard, PlanCard } from "@/shared/ui/composite/Composite";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import {
  blogPosts,
  faqItems,
  featureCards,
  marqueeItems,
  platformCards,
  stats,
  steps,
  testimonials,
} from "@/widgets/marketing/home/model/content";
import { homeFreePlanSummary, homePricingNote, homePricingPlans } from "@/widgets/marketing/home/model/pricing";
import styles from "./HomeSections.module.scss";

function SectionHeading({
  label,
  title,
  description,
  centered = false,
}: {
  label?: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <header className={[styles.sectionHeading, centered && styles.sectionHeadingCentered].filter(Boolean).join(" ")}>
      {label ? <span className={styles.sectionLabel}>{label}</span> : null}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </header>
  );
}

function MarketplaceTag({ label, tone }: { label: string; tone: "wb" | "ozon" | "ym" | "accent" }) {
  return <Badge tone={tone}>{label}</Badge>;
}

export function HomeSections() {
  return (
    <>
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className={styles.marqueeItem}>
              <span className={styles.marqueeDot}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.containerNarrow}>
          <SectionHeading
            label="Отзывы продавцов"
            title={<>Сервисом уже пользуются 800+ продавцов, менеджеров и агентств</>}
          />

          <div className={styles.cardsThree}>
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className={[styles.surfaceCard, styles.testimonialCard].join(" ")}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.testimonialQuote}>«{testimonial.quote}»</p>
                <div className={styles.testimonialAuthor}>
                  <Avatar initials={testimonial.initials} gradient={testimonial.gradient} />
                  <div>
                    <div className={styles.testimonialName}>
                      {testimonial.name} <MarketplaceTag label={testimonial.tone.toUpperCase()} tone={testimonial.tone} />
                    </div>
                    <div className={styles.testimonialMeta}>{testimonial.category}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className={styles.section}>
        <div className={styles.containerNarrow}>
          <SectionHeading
            label="Как это работает"
            title={<>Три шага до готовой карточки товара</>}
            description="От исходной фотографии до карточки для маркетплейса без дизайнера, долгих согласований и ручной подготовки каждого слайда."
          />

          <div className={styles.cardsThree}>
            {steps.map((step, index) => (
              <article key={step.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                {index < steps.length - 1 ? <span className={styles.stepArrow}>→</span> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className={styles.sectionMuted}>
        <div className={styles.containerNarrow}>
          <SectionHeading
            label="Поддерживаемые площадки"
            title={<>Карточки под требования Wildberries, Ozon и Яндекс Маркета</>}
            description="Сервис учитывает формат изображений, требования к фону, композиции и подаче контента для каждой площадки."
          />

          <div className={styles.cardsThree}>
            {platformCards.map((platform) => (
              <article key={platform.label} className={styles.surfaceCard}>
                <div className={styles.platformHeader}>
                  <div className={[styles.platformIcon, styles[`platformIcon${platform.tone}`]].join(" ")}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className={[styles.platformName, styles[`platformName${platform.tone}`]].join(" ")}>
                      {platform.label}
                    </h3>
                    <p className={styles.platformMeta}>{platform.meta}</p>
                  </div>
                </div>

                <ul className={styles.specList}>
                  {platform.specs.map((spec) => (
                    <li key={spec} className={styles.specItem}>
                      <span className={styles.specCheck}>✓</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className={styles.featuresSection}>
        <div className={styles.containerNarrow}>
          <SectionHeading
            label="Возможности"
            title={<>Всё, что нужно для продающих карточек товаров</>}
            description="Для селлеров, контент-менеджеров и агентств, которым нужен быстрый выпуск карточек без потери качества."
          />

          <div className={styles.featuresGrid}>
            {featureCards.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.statsSection} aria-label="Ключевые показатели">
        <div className={styles.containerNarrow}>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.surfaceCard}>
                <div className={styles.statValue}>
                  {stat.value}
                  {stat.accent ? <span>{stat.accent}</span> : null}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <div className={styles.containerTight}>
          <SectionHeading
            label="Тарифы"
            title={<>Тарифы для селлеров, команд и агентств</>}
            description={homePricingNote}
            centered
          />

          <div className={styles.pricingGrid}>
            {homePricingPlans.map((plan, index) => (
              <PlanCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                popular={plan.popular}
                wide={index === homePricingPlans.length - 1 && homePricingPlans.length % 3 !== 0}
                action={
                  <Button as={Link} href="/auth" variant={plan.actionVariant} size="lg" block>
                    {plan.actionLabel}
                  </Button>
                }
              />
            ))}
          </div>
          <p className={styles.pricingCaption}>
            Во всех тарифах доступны генерация карточек, инфографика, обработка фото и тексты для маркетплейсов.
            Отличается только месячный объём и условия для командной работы.
          </p>
        </div>
      </section>

      <section id="blog" className={styles.section}>
        <div className={styles.containerNarrow}>
          <SectionHeading
            label="Блог"
            title={<>Полезные статьи для продавцов на маркетплейсах</>}
            description="Разбираем требования площадок, оформление карточек товаров, инфографику и способы повышать конверсию."
          />

          <div className={styles.cardsThree}>
            {blogPosts.map((post) => (
              <article key={post.title} className={styles.blogCardWrap}>
                <BlogCard
                  title={post.title}
                  meta={post.meta}
                  gradient={post.gradient}
                  image={post.image}
                  imageAlt={post.imageAlt}
                  tag={<Badge tone={post.tone}>{post.tag}</Badge>}
                  href={post.href}
                />
              </article>
            ))}
          </div>

          <div className={styles.centeredAction}>
            <Button as={Link} href="/blog" variant="outline" size="lg">
              Все статьи блога →
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.containerFaq}>
          <SectionHeading label="FAQ" title={<>Частые вопросы о генерации карточек товаров</>} centered />
          <Accordion items={faqItems} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <SectionHeading
            title={<>Запустите первую генерацию бесплатно</>}
            description={homeFreePlanSummary}
            centered
          />
          <Button as={Link} href="/auth" size="xl" className={styles.ctaButton}>
            Начать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
