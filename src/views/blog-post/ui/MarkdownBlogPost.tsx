import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getMarkdownBlogToc, slugifyHeading, type MarkdownBlogPost } from "@/entities/blog/model/toc";
import type { SeoLinkGroup } from "@/shared/seo/internal-linking";
import { SeoLinkSection } from "@/shared/ui/internal-links/SeoLinkSection";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import { BlogPostShare } from "@/widgets/marketing/blog-post/ui/BlogPostShare";
import styles from "@/widgets/marketing/blog-post/ui/BlogPost.module.scss";

type MarkdownBlogPostProps = {
  post: MarkdownBlogPost;
  canonicalUrl: string;
  commercialLinkGroups: SeoLinkGroup[];
  relatedPosts: Pick<MarkdownBlogPost, "slug" | "canonicalPath" | "categoryLabel" | "title">[];
  popularPosts: Pick<MarkdownBlogPost, "slug" | "canonicalPath" | "title">[];
};

const previewGradients = [
  "linear-gradient(135deg, #0f3460, #e94560)",
  "linear-gradient(135deg, #1a472a, #52b788)",
  "linear-gradient(135deg, #2d1b69, #f5a623)",
  "linear-gradient(135deg, #2c3e50, #f39c12)",
  "linear-gradient(135deg, #6a0572, #e040fb)",
  "linear-gradient(135deg, #1b4332, #95d5b2)",
];

const relatedGradients = [
  "linear-gradient(135deg, #fef3e2, #fdd89a)",
  "linear-gradient(135deg, #e8f4fd, #b3d9f7)",
  "linear-gradient(135deg, #e8f8f2, #95d5b2)",
  "linear-gradient(135deg, #fce8e8, #f5a3a3)",
];

export function MarkdownBlogPost({ post, canonicalUrl, commercialLinkGroups, relatedPosts, popularPosts }: MarkdownBlogPostProps) {
  const tocItems = getMarkdownBlogToc(post.content);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <article className={styles.article}>
          <header className={styles.postHeader}>
            <div className={styles.tagList}>
              {post.tags.map((tag) => (
                <Badge key={tag.label} tone={tag.tone} className={styles.postTag}>
                  {tag.label}
                </Badge>
              ))}
            </div>

            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>

            <div className={styles.metaRow}>
              <div className={styles.authorRow}>
                <div className={styles.authorAvatar}>{post.authorInitials}</div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.authorMeta}>{post.publishedLabel}</div>
                </div>
              </div>

              <div className={styles.metaDivider} />
              <div className={styles.metaItem}>
                ⏱ <strong>{post.readingTime}</strong> чтения
              </div>
              <div className={styles.metaItem}>
                👁 <strong>{post.views}</strong> просмотров
              </div>
              <div className={styles.metaItem}>
                🔄 Обновлено <strong>{post.updatedLabel}</strong>
              </div>

              <BlogPostShare url={canonicalUrl} title={post.title} />
            </div>
          </header>

          <div className={styles.hero}>
            <div className={styles.heroGrid} aria-hidden="true">
              {previewGradients.map((gradient) => (
                <span key={gradient} className={styles.heroThumb} style={{ background: gradient }} />
              ))}
            </div>
            <div className={styles.heroCaption}>{post.heroCaption}</div>
          </div>

          {tocItems.length > 0 ? (
            <details className={styles.mobileToc}>
              <summary className={styles.mobileTocSummary}>Содержание</summary>
              <ul className={styles.mobileTocList}>
                {tocItems.map((item) => (
                  <li
                    key={item.id}
                    className={[styles.mobileTocItem, item.level === 3 && styles.mobileTocItemSub].filter(Boolean).join(" ")}
                  >
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <div className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const text = childrenToText(children);
                  return <h2 id={slugifyHeading(text)}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = childrenToText(children);
                  return <h3 id={slugifyHeading(text)}>{children}</h3>;
                },
                a: ({ href, children }) => {
                  if (href?.startsWith("/")) {
                    return <Link href={href}>{children}</Link>;
                  }

                  return (
                    <a href={href} target="_blank" rel="noreferrer">
                      {children}
                    </a>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>

            <section className={styles.footerTags}>
              <div className={styles.footerTagsLabel}>Теги</div>
              <div className={styles.footerTagList}>
                {post.footerTags.map((tag) => (
                  <Link key={tag} href="/blog" className={styles.footerTag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </section>

            <SeoLinkSection
              eyebrow="Коммерческие хабы"
              title="Полезные страницы по теме статьи"
              intro="Информационная статья должна передавать вес в коммерческие разделы: страницы площадок, инструменты и шаблоны."
              groups={commercialLinkGroups}
            />

            {relatedPosts.length > 0 ? (
              <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>Читайте также</h2>
                <div className={styles.relatedGrid}>
                  {relatedPosts.map((item, index) => (
                    <Link key={item.slug} href={item.canonicalPath} className={styles.relatedCard}>
                      <div className={styles.relatedVisual} style={{ background: relatedGradients[index % relatedGradients.length] }} />
                      <div className={styles.relatedBody}>
                        <div className={styles.relatedTag}>{item.categoryLabel}</div>
                        <div className={styles.relatedCardTitle}>{item.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className={styles.banner}>
              <div className={styles.bannerText}>
                <h3 className={styles.bannerTitle}>Соберите карточки быстрее</h3>
                <p className={styles.bannerDescription}>
                  Загрузите фото товара и получите готовые карточки для Wildberries, Ozon и Яндекс Маркета с нужным форматом и инфографикой.
                </p>
              </div>
              <Button as={Link} href="/auth" size="lg">
                Попробовать бесплатно
              </Button>
            </section>
          </div>
        </article>

        <aside className={styles.sidebar}>
          {tocItems.length > 0 ? (
            <section className={styles.sidebarCard}>
              <div className={styles.sidebarTitle}>Содержание</div>
              <ul className={styles.tocList}>
                {tocItems.map((item) => (
                  <li key={item.id} className={[styles.tocItem, item.level === 3 && styles.tocItemSub].filter(Boolean).join(" ")}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className={styles.sidebarCta}>
            <h2 className={styles.sidebarCtaTitle}>Сделай карточки автоматически</h2>
            <p className={styles.sidebarCtaText}>
              Загрузите фото и получите готовые карточки для WB, Ozon и Яндекс Маркета за 30 секунд.
            </p>
            <Button as={Link} href="/auth" size="lg" block>
              Попробовать бесплатно
            </Button>
          </section>

          <section className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Популярные статьи</div>
            <div className={styles.popularList}>
              {popularPosts.map((item, index) => (
                <Link key={item.slug} href={item.canonicalPath} className={styles.popularItem}>
                  <span className={styles.popularNumber}>{index + 1}</span>
                  <span className={styles.popularText}>{item.title}</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    return childrenToText((children as { props?: { children?: ReactNode } }).props?.children ?? "");
  }

  return "";
}
