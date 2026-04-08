import Link from "next/link";
import {
  bannedOnWildberries,
  blogPost,
  type BlogTableCellTone,
  breadcrumbItems,
  callouts,
  comparisonTable,
  faqItems,
  heroGradients,
  overviewCards,
  ozonTable,
  popularPosts,
  preparationSteps,
  relatedPosts,
  tocItems,
  wildberriesTable,
  yandexFeatures,
  yandexTable,
} from "@/entities/blog/model/content";
import { blogHeaderLinks, legalFooterLinks } from "@/shared/config/marketing";
import { siteConfig } from "@/shared/config/site";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import { BlogPostEnhancements } from "./BlogPostEnhancements";
import { BlogPostShare } from "./BlogPostShare";
import styles from "./BlogPost.module.scss";

function Callout({
  tone,
  title,
  text,
}: {
  tone: "tip" | "warn" | "info";
  title: string;
  text: string;
}) {
  const icon = tone === "tip" ? "💡" : tone === "warn" ? "⚠" : "ℹ";

  return (
    <div className={[styles.callout, styles[`callout${tone}`]].join(" ")}>
      <span className={styles.calloutIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.calloutText}>
        <strong>{title}</strong> {text}
      </span>
    </div>
  );
}

function DataTable({
  head,
  rows,
  emphasizedColumns = [],
  cellTones,
}: {
  head: readonly string[];
  rows: readonly (readonly string[])[];
  emphasizedColumns?: number[];
  cellTones?: readonly (readonly (BlogTableCellTone | null)[])[];
}) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th
                key={`${cell}-${index}`}
                className={emphasizedColumns.includes(index) ? styles.emphasizedHeading : undefined}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => {
                const tone = cellTones?.[rowIndex]?.[index];

                return (
                  <td
                    key={`${cell}-${index}`}
                    className={[
                      tone === "success" ? styles.checkCell : undefined,
                      tone === "muted" ? styles.crossCell : undefined,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BlogPost() {
  const canonicalUrl = `${siteConfig.defaultUrl}${blogPost.canonicalPath}`;

  return (
    <main className={styles.page}>
      <div id="read-progress" className={styles.readProgress} aria-hidden="true" />
      <BlogPostEnhancements />

      <SiteHeader links={blogHeaderLinks} />

      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        {breadcrumbItems.map((item, index) => (
          <div key={item.label} className={styles.breadcrumbItem}>
            {"href" in item ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {index < breadcrumbItems.length - 1 ? (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                ›
              </span>
            ) : null}
          </div>
        ))}
      </nav>

      <div className={styles.layout}>
        <article id="blog-post-article" className={styles.article}>
          <header className={styles.postHeader}>
            <div className={styles.tagList}>
              {blogPost.tags.map((tag) => (
                <Badge key={tag.label} tone={tag.tone} className={styles.postTag}>
                  {tag.label}
                </Badge>
              ))}
            </div>

            <h1 className={styles.title}>{blogPost.title}</h1>
            <p className={styles.excerpt}>{blogPost.excerpt}</p>

            <div className={styles.metaRow}>
              <div className={styles.authorRow}>
                <div className={styles.authorAvatar}>{blogPost.authorInitials}</div>
                <div>
                  <div className={styles.authorName}>{blogPost.author}</div>
                  <div className={styles.authorMeta}>{blogPost.publishedLabel}</div>
                </div>
              </div>

              <div className={styles.metaDivider} />
              <div className={styles.metaItem}>
                ⏱ <strong>{blogPost.readingTime}</strong> чтения
              </div>
              <div className={styles.metaItem}>
                👁 <strong>{blogPost.views}</strong> просмотров
              </div>
              <div className={styles.metaItem}>
                🔄 Обновлено <strong>{blogPost.updatedLabel}</strong>
              </div>

              <BlogPostShare url={canonicalUrl} title={blogPost.title} />
            </div>
          </header>

          <div className={styles.hero}>
            <div className={styles.heroGrid} aria-hidden="true">
              {heroGradients.map((gradient, index) => (
                <span
                  key={gradient}
                  className={styles.heroThumb}
                  style={{ background: gradient, animationDelay: `${index * 80}ms` }}
                />
              ))}
            </div>
            <div className={styles.heroCaption}>{blogPost.heroCaption}</div>
          </div>

          <details className={styles.mobileToc}>
            <summary className={styles.mobileTocSummary}>Содержание</summary>
            <ul className={styles.mobileTocList}>
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={[styles.mobileTocItem, "level" in item && item.level === 2 && styles.mobileTocItemSub]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </details>

          <div className={styles.content}>
            <p>{blogPost.intro}</p>

            <h2 id="overview">Сравнение требований трёх площадок</h2>
            <div className={styles.platformGrid}>
              {overviewCards.map((card) => (
                <article key={card.name} className={[styles.platformCard, styles[`platformCard${card.tone}`]].join(" ")}>
                  <h3 className={[styles.platformName, styles[`platformName${card.tone}`]].join(" ")}>{card.name}</h3>
                  <div className={styles.platformSpecs}>
                    {card.specs.map(([label, value]) => (
                      <div key={`${card.name}-${label}`} className={styles.specRow}>
                        <span className={styles.specLabel}>{label}</span>
                        <span className={styles.specValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <Callout {...callouts.overview} />

            <h2 id="wildberries">Wildberries: требования к фото в 2025</h2>
            <p>
              WB самый лояльный маркетплейс в плане требований к фону. Здесь можно использовать любой фон, если товар
              хорошо читается. Но у площадки есть строгие ограничения по размеру изображения и соотношению сторон.
            </p>

            <h3 id="wb-sizes">Размеры и технические параметры</h3>
            <DataTable head={wildberriesTable.head} rows={wildberriesTable.rows} />

            <h3 id="wb-rules">Что запрещено на фото WB</h3>
            <ul>
              {bannedOnWildberries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Callout {...callouts.wildberries} />

            <h2 id="ozon">Ozon: требования к фото в 2025</h2>
            <p>
              Ozon строже WB в плане главного изображения. Для большинства категорий основное фото должно быть на белом
              или светло-сером фоне, а сам товар должен занимать большую часть кадра.
            </p>

            <h3 id="ozon-sizes">Размеры и форматы</h3>
            <DataTable head={ozonTable.head} rows={ozonTable.rows} />
            <Callout {...callouts.ozon} />

            <h2 id="yandex">Яндекс Маркет: требования к фото в 2025</h2>
            <p>
              Яндекс Маркет активно растёт и особенно силён в электронике, товарах для дома и технике. Требования
              здесь близки к Ozon, но площадка чуть гибче по форматам и даёт больше медиа-возможностей.
            </p>

            <h3 id="ym-sizes">Размеры и особенности</h3>
            <DataTable head={yandexTable.head} rows={yandexTable.rows} cellTones={yandexTable.cellTones} />

            <h3 id="ym-special">Особенности Яндекс Маркет</h3>
            <ul>
              {yandexFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 id="how-to">Как подготовить фото: пошаговый процесс</h2>
            <div className={styles.steps}>
              {preparationSteps.map((step, index) => (
                <article key={step.title} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <h2 id="comparison">Полная сравнительная таблица</h2>
            <DataTable
              head={comparisonTable.head}
              rows={comparisonTable.rows}
              emphasizedColumns={[1, 2, 3]}
              cellTones={comparisonTable.cellTones}
            />

            <section className={styles.banner}>
              <div className={styles.bannerText}>
                <h3 className={styles.bannerTitle}>Устал делать карточки вручную?</h3>
                <p className={styles.bannerDescription}>
                  Загрузи фото товара, и kartochki.online автоматически подготовит версии для WB, Ozon и Яндекс Маркет
                  с правильными размерами и инфографикой.
                </p>
              </div>
              <Button as={Link} href="/auth" size="lg">
                Попробовать бесплатно
              </Button>
            </section>

            <h2 id="faq">Частые вопросы</h2>
            {faqItems.map((item) => (
              <section key={item.question} className={styles.faqItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </section>
            ))}

            <section className={styles.footerTags}>
              <div className={styles.footerTagsLabel}>Теги</div>
              <div className={styles.footerTagList}>
                {blogPost.footerTags.map((tag) => (
                  <Link key={tag} href="/blog" className={styles.footerTag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Читайте также</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((post) => (
                  <article key={post.title} className={styles.relatedCard}>
                    <div className={styles.relatedVisual} style={{ background: post.gradient }} />
                    <div className={styles.relatedBody}>
                      <div className={styles.relatedTag}>{post.tag}</div>
                      <div className={styles.relatedCardTitle}>{post.title}</div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Содержание</div>
            <ul className={styles.tocList}>
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={[styles.tocItem, "level" in item && item.level === 2 && styles.tocItemSub]
                    .filter(Boolean)
                    .join(" ")}
                  data-toc-item={item.id}
                  data-active={item.id === "overview" ? "true" : "false"}
                >
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.sidebarCta}>
            <h2 className={styles.sidebarCtaTitle}>Сделай карточки автоматически</h2>
            <p className={styles.sidebarCtaText}>
              Загрузи фото и получи готовые карточки для WB, Ozon и Яндекс Маркет за 30 секунд.
            </p>
            <Button as={Link} href="/auth" size="lg" block>
              Попробовать бесплатно
            </Button>
          </section>

          <section className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Популярные статьи</div>
            <div className={styles.popularList}>
              {popularPosts.map((title, index) => (
                <article key={title} className={styles.popularItem}>
                  <span className={styles.popularNumber}>{index + 1}</span>
                  <span className={styles.popularText}>{title}</span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <SiteFooter links={legalFooterLinks} />
    </main>
  );
}
