import Link from "next/link";
import {
  blogCategories,
  blogFeedPosts,
  blogFilterChips,
  blogHeroStats,
  blogListingSchema,
  blogPopularPosts,
  blogPost,
  blogTags,
  heroGradients,
  moreBlogPosts,
} from "@/entities/blog/model/content";
import { blogHeaderLinks, legalFooterLinks } from "@/shared/config/marketing";
import { Button } from "@/shared/ui/primitives/Primitives";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import styles from "./BlogPage.module.scss";

export function BlogPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingSchema) }} />

      <SiteHeader links={blogHeaderLinks} />

      <section className={[styles.hero, styles.reveal].join(" ")}>
        <div>
          <div className={styles.heroLabel}>Блог для продавцов</div>
          <h1 className={styles.heroTitle}>Как создавать карточки товаров, которые продают</h1>
          <p className={styles.heroDescription}>
            Требования площадок, советы по инфографике, фото и оформлению карточек для маркетплейсов.
          </p>
        </div>

        <div className={styles.heroStats}>
          {blogHeroStats.map((stat) => (
            <div key={stat.label} className={styles.heroStat}>
              <div className={styles.heroStatValue}>{stat.value}</div>
              <div className={styles.heroStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.layout}>
        <main className={styles.feed}>
          <div className={[styles.filters, styles.reveal, styles.delay1].join(" ")} aria-label="Фильтры блога">
            {blogFilterChips.map((chip, index) => (
              <button
                key={chip}
                type="button"
                className={[styles.filterChip, index === 0 && styles.filterChipActive].filter(Boolean).join(" ")}
              >
                {chip}
              </button>
            ))}
          </div>

          <Link href={blogPost.canonicalPath} className={[styles.featuredPost, styles.reveal, styles.delay2].join(" ")}>
            <div className={styles.featuredVisual} aria-hidden="true">
              <div className={styles.featuredMock}>
                {heroGradients.map((gradient, index) => (
                  <span
                    key={gradient}
                    className={styles.featuredThumb}
                    style={{ background: gradient, animationDelay: `${index * 80}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.featuredContent}>
              <div className={styles.featuredTag}>Главная статья</div>
              <h2 className={styles.featuredTitle}>{blogPost.title}</h2>
              <p className={styles.featuredExcerpt}>{blogPost.excerpt}</p>

              <div className={styles.featuredMeta}>
                <div className={styles.metaAvatar}>{blogPost.authorInitials}</div>
                <div className={styles.metaInfo}>
                  <div className={styles.metaAuthor}>{blogPost.author}</div>
                  <div className={styles.metaDate}>{blogPost.publishedLabel}</div>
                </div>
                <div className={styles.metaRead}>{blogPost.readingTime} →</div>
              </div>
            </div>
          </Link>

          <div className={styles.postsGrid}>
            {blogFeedPosts.map((post) => (
              <article key={post.title} className={[styles.reveal, styles.delay3].join(" ")}>
                <Link href={post.href ?? blogPost.canonicalPath} className={styles.postCard}>
                  <div className={[styles.postVisual, styles[post.visualClass]].join(" ")}>
                    <div className={styles.postVisualInner} />
                    <div className={[styles.postVisualLabel, styles[`label${post.visualTone}`]].join(" ")}>
                      {post.visualLabel}
                    </div>
                    <div className={styles.postVisualDecor} aria-hidden="true">
                      {post.decor}
                    </div>
                  </div>

                  <div className={styles.postBody}>
                    <div className={styles.postTag}>{post.categoryLabel}</div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.postFooter}>
                      <span className={styles.postMeta}>{post.meta}</span>
                      <span className={styles.postRead}>{post.readLabel} →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <section className={[styles.moreSection, styles.reveal, styles.delay4].join(" ")}>
            <h2 className={styles.moreTitle}>Ещё статьи</h2>
            <div className={styles.postsList}>
              {moreBlogPosts.map((post) => (
                <Link key={post.number} href={post.href ?? blogPost.canonicalPath} className={styles.listPost}>
                  <div className={styles.listNumber}>{post.number}</div>
                  <div className={styles.listBody}>
                    <div className={styles.listTag}>{post.tag}</div>
                    <div className={styles.listTitle}>{post.title}</div>
                    <div className={styles.listMeta}>{post.meta}</div>
                  </div>
                  <div className={styles.listArrow}>→</div>
                </Link>
              ))}
            </div>
          </section>

          <div className={[styles.loadMore, styles.reveal, styles.delay5].join(" ")}>
            <Button as="button" type="button" variant="outline" size="lg">
              Показать ещё статьи
            </Button>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <section className={[styles.sidebarWidget, styles.reveal, styles.delay1].join(" ")}>
            <div className={styles.widgetHeader}>Поиск по блогу</div>
            <div className={styles.widgetBody}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>⌕</span>
                <input className={styles.searchInput} type="search" placeholder="Инфографика, требования..." readOnly />
              </div>
            </div>
          </section>

          <section className={[styles.ctaWidget, styles.reveal, styles.delay2].join(" ")}>
            <div className={styles.ctaTitle}>Попробуй бесплатно</div>
            <div className={styles.ctaText}>10 карточек без карты. Загрузи фото и получи готовый сет за 30 секунд.</div>
            <Button as={Link} href="/auth" size="lg" block>
              Начать →
            </Button>
          </section>

          <section className={[styles.sidebarWidget, styles.reveal, styles.delay3].join(" ")}>
            <div className={styles.widgetHeader}>Категории</div>
            <div className={styles.widgetBody}>
              <div className={styles.categories}>
                {blogCategories.map((category) => (
                  <Link key={category.label} href={blogPost.canonicalPath} className={styles.categoryItem}>
                    <span>{category.label}</span>
                    <span className={styles.categoryCount}>{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className={[styles.sidebarWidget, styles.reveal, styles.delay4].join(" ")}>
            <div className={styles.widgetHeader}>Популярные статьи</div>
            <div className={styles.widgetBody}>
              <div className={styles.popularList}>
                {blogPopularPosts.map((post, index) => (
                  <Link key={post.title} href={post.href ?? blogPost.canonicalPath} className={styles.popularItem}>
                    <div className={styles.popularNumber}>{index + 1}</div>
                    <div>
                      <div className={styles.popularTitle}>{post.title}</div>
                      <div className={styles.popularMeta}>{post.meta}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className={[styles.sidebarWidget, styles.reveal, styles.delay5].join(" ")}>
            <div className={styles.widgetHeader}>Теги</div>
            <div className={styles.widgetBody}>
              <div className={styles.tagsCloud}>
                {blogTags.map((tag) => (
                  <Link key={tag} href={blogPost.canonicalPath} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className={[styles.sidebarWidget, styles.reveal, styles.delay6].join(" ")}>
            <div className={styles.widgetHeader}>Рассылка</div>
            <div className={styles.widgetBody}>
              <p className={styles.newsletterLead}>Новые статьи и советы раз в неделю. Без спама.</p>
              <div className={styles.newsletterForm}>
                <input className={styles.newsletterInput} type="email" placeholder="your@email.com" readOnly />
                <button type="button" className={styles.newsletterButton}>
                  Подписаться
                </button>
                <div className={styles.newsletterNote}>Отписаться можно в любой момент</div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <SiteFooter links={legalFooterLinks} />
    </main>
  );
}
