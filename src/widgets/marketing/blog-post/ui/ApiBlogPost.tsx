import Link from "next/link";
import type { BlogArticleSection, BlogPostResponse, BlogSectionCallout, BlogSectionTable } from "@/shared/api";
import { siteConfig } from "@/shared/config/site";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import { BlogPostEnhancements } from "./BlogPostEnhancements";
import { BlogPostShare } from "./BlogPostShare";
import styles from "./BlogPost.module.scss";

type ApiBlogPostProps = {
  content: BlogPostResponse;
};

const HOME_LABEL = "\u0413\u043B\u0430\u0432\u043D\u0430\u044F";
const BLOG_LABEL = "\u0411\u043B\u043E\u0433";
const UPDATED_LABEL = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E";
const READ_TIME_LABEL = "\u043C\u0438\u043D \u0447\u0442\u0435\u043D\u0438\u044F";
const VIEWS_LABEL = "\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u0432";
const TOC_LABEL = "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435";
const TRY_LABEL = "\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E";
const CTA_TITLE = "\u0421\u0434\u0435\u043B\u0430\u0439\u0442\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438";
const CTA_TEXT = "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u043E\u0442\u043E \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0433\u043E\u0442\u043E\u0432\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0434\u043B\u044F \u043C\u0430\u0440\u043A\u0435\u0442\u043F\u043B\u0435\u0439\u0441\u043E\u0432.";
const RELATED_LABEL = "\u0427\u0438\u0442\u0430\u0439\u0442\u0435 \u0442\u0430\u043A\u0436\u0435";

export function ApiBlogPost({ content }: ApiBlogPostProps) {
  const { post, article_sections: sections, related_posts: relatedPosts } = content;
  const canonicalUrl = `${siteConfig.defaultUrl}${post.canonical_path}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "kartochki.online",
    },
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div id="read-progress" className={styles.readProgress} aria-hidden="true" />
      <BlogPostEnhancements />

      <nav className={styles.breadcrumbs} aria-label={TOC_LABEL}>
        <div className={styles.breadcrumbItem}>
          <Link href="/">{HOME_LABEL}</Link>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
        </div>
        <div className={styles.breadcrumbItem}>
          <Link href="/blog">{BLOG_LABEL}</Link>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
        </div>
        <div className={styles.breadcrumbItem}>
          <span>{post.title}</span>
        </div>
      </nav>

      <div className={styles.layout}>
        <article id="blog-post-article" className={styles.article}>
          <header className={styles.postHeader}>
            <div className={styles.tagList}>
              {post.tags.map((tag) => (
                <Badge key={tag.slug} tone="neutral" className={styles.postTag}>
                  {tag.label}
                </Badge>
              ))}
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <strong>{post.reading_time_minutes}</strong> {READ_TIME_LABEL}
              </div>
              <div className={styles.metaItem}>
                <strong>{post.views}</strong> {VIEWS_LABEL}
              </div>
              <div className={styles.metaItem}>
                {UPDATED_LABEL} <strong>{formatDate(post.updated_at)}</strong>
              </div>
              <BlogPostShare url={canonicalUrl} title={post.title} />
            </div>
          </header>

          <details className={styles.mobileToc}>
            <summary className={styles.mobileTocSummary}>{TOC_LABEL}</summary>
            <TocList sections={sections} mobile />
          </details>

          <div className={styles.content}>
            {sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}

            {relatedPosts.length > 0 ? (
              <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>{RELATED_LABEL}</h2>
                <div className={styles.relatedGrid}>
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} href={related.canonical_path} className={styles.relatedCard}>
                      <div className={styles.relatedBody}>
                        <div className={styles.relatedCardTitle}>{related.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>{TOC_LABEL}</div>
            <TocList sections={sections} />
          </section>
          <section className={styles.sidebarCta}>
            <h2 className={styles.sidebarCtaTitle}>{CTA_TITLE}</h2>
            <p className={styles.sidebarCtaText}>{CTA_TEXT}</p>
            <Button as={Link} href="/auth" size="lg" block>{TRY_LABEL}</Button>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Section({ section }: { section: BlogArticleSection }) {
  return (
    <section id={section.id}>
      {section.level >= 3 ? <h3>{section.title}</h3> : <h2>{section.title}</h2>}
      {section.body ? <p>{section.body}</p> : null}
      {section.kind === "list" && section.list ? <List items={section.list} /> : null}
      {section.kind === "table" && section.table ? <DataTable table={section.table} /> : null}
      {section.kind === "callout" && section.callout ? <Callout callout={section.callout} /> : null}
      {section.kind === "cards" && section.cards ? (
        <div className={styles.relatedGrid}>
          {section.cards.map((card) => (
            <article key={card.title} className={styles.relatedCard}>
              <div className={styles.relatedBody}>
                <div className={styles.relatedCardTitle}>{card.title}</div>
                {card.meta?.map((row) => (
                  <p key={row.label}>{row.label}: {row.value}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {section.kind === "steps" && section.steps ? (
        <div className={styles.steps}>
          {section.steps.map((step, index) => (
            <article key={step.title} className={styles.stepItem}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TocList({ sections, mobile = false }: { sections: ReadonlyArray<BlogArticleSection>; mobile?: boolean }) {
  return (
    <ul className={mobile ? styles.mobileTocList : styles.tocList}>
      {sections.map((section, index) => (
        <li
          key={section.id}
          className={[
            mobile ? styles.mobileTocItem : styles.tocItem,
            section.level >= 3 ? (mobile ? styles.mobileTocItemSub : styles.tocItemSub) : undefined,
          ].filter(Boolean).join(" ")}
          data-active={index === 0 ? "true" : "false"}
          data-toc-item={section.id}
        >
          <a href={`#${section.id}`}>{section.title}</a>
        </li>
      ))}
    </ul>
  );
}

function List({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DataTable({ table }: { table: BlogSectionTable }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>{table.head.map((cell) => <th key={cell}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ callout }: { callout: BlogSectionCallout }) {
  return (
    <div className={[styles.callout, styles.calloutinfo].join(" ")}>
      <span className={styles.calloutText}>
        <strong>{callout.title}</strong> {callout.text}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
