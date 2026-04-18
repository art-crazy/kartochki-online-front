import Link from "next/link";
import {
  blogHeroStats,
  blogListingSchema,
  heroGradients,
} from "@/entities/blog/model/content";
import { blogHeaderLinks, legalFooterLinks } from "@/shared/config/marketing";
import { SeoBreadcrumbs } from "@/shared/ui";
import { Button } from "@/shared/ui/primitives/Primitives";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import { fallbackBlogPageContent, type BlogPageContent } from "@/views/blog/model/content";
import styles from "./BlogPage.module.scss";

type BlogPageProps = {
  content?: BlogPageContent;
};

export function BlogPage({ content = fallbackBlogPageContent }: BlogPageProps) {
  const hasNextPage = content.pagination.page < content.pagination.totalPages;
  const nextPageHref = `/blog?page=${content.pagination.page + 1}`;
  const currentPath = content.pagination.page > 1 ? `/blog?page=${content.pagination.page}` : "/blog";

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingSchema) }} />

      <SiteHeader links={blogHeaderLinks} />
      <SeoBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог" },
        ]}
        currentPath={currentPath}
      />

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
            {content.filterChips.map((chip, index) => (
              <button
                key={chip}
                type="button"
                className={[styles.filterChip, index === 0 && styles.filterChipActive].filter(Boolean).join(" ")}
              >
                {chip}
              </button>
            ))}
          </div>

          <Link href={content.featuredPost.href} className={[styles.featuredPost, styles.reveal, styles.delay2].join(" ")}>
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
              <h2 className={styles.featuredTitle}>{content.featuredPost.title}</h2>
              <p className={styles.featuredExcerpt}>{content.featuredPost.excerpt}</p>

              <div className={styles.featuredMeta}>
                <div className={styles.metaAvatar}>{content.featuredPost.authorInitials}</div>
                <div className={styles.metaInfo}>
                  <div className={styles.metaAuthor}>{content.featuredPost.author}</div>
                  <div className={styles.metaDate}>{content.featuredPost.publishedLabel}</div>
                </div>
                <div className={styles.metaRead}>{content.featuredPost.readingTime} →</div>
              </div>
            </div>
          </Link>

          <div className={styles.postsGrid}>
            {content.feedPosts.map((post) => (
              <article key={post.title} className={[styles.reveal, styles.delay3].join(" ")}>
                <Link href={post.href ?? content.featuredPost.href} className={styles.postCard}>
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
              {content.morePosts.map((post) => (
                <Link key={`${post.number}-${post.title}`} href={post.href ?? content.featuredPost.href} className={styles.listPost}>
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

          {hasNextPage ? (
            <div className={[styles.loadMore, styles.reveal, styles.delay5].join(" ")}>
              <Button as={Link} href={nextPageHref} variant="outline" size="lg">
                Показать ещё статьи
              </Button>
            </div>
          ) : null}
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
                {content.categories.map((category) => (
                  <Link key={category.label} href={category.href} className={styles.categoryItem}>
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
                {content.popularPosts.map((post, index) => (
                  <Link key={post.title} href={post.href} className={styles.popularItem}>
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
                {content.tags.map((tag) => (
                  <Link key={tag.label} href={tag.href} className={styles.tag}>
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

        </aside>
      </div>

      <SiteFooter links={legalFooterLinks} />
    </main>
  );
}
