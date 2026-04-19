import Link from "next/link";
import type { BlogArticleSection, BlogPostResponse, BlogSectionCallout, BlogSectionTable } from "@/shared/api";
import { buildCanonicalUrl } from "@/shared/seo";
import { SeoJsonLd } from "@/shared/ui";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import { buildArticleSchema } from "../model/structuredData";
import { BlogPostEnhancements } from "./BlogPostEnhancements";
import { BlogPostShare } from "./BlogPostShare";
import styles from "./BlogPost.module.scss";

type ApiBlogPostProps = {
  content: BlogPostResponse;
};

const UPDATED_LABEL = "Обновлено";
const READ_TIME_LABEL = "мин чтения";
const VIEWS_LABEL = "просмотров";
const TOC_LABEL = "Содержание";
const TRY_LABEL = "Попробовать бесплатно";
const CTA_TITLE = "Сделайте карточки автоматически";
const CTA_TEXT = "Загрузите фото и получите готовые карточки для маркетплейсов.";
const RELATED_LABEL = "Читайте также";

export function ApiBlogPost({ content }: ApiBlogPostProps) {
  const { post, article_sections: sections, related_posts: relatedPosts } = content;
  const canonicalUrl = buildCanonicalUrl(post.canonical_path);

  return (
    <main className={styles.page}>
      <SeoJsonLd data={buildArticleSchema(post)} />
      <div id="read-progress" className={styles.readProgress} aria-hidden="true" />
      <BlogPostEnhancements />

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
            <Button as={Link} href="/auth" size="lg" block>
              {TRY_LABEL}
            </Button>
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
                  <p key={row.label}>
                    {row.label}: {row.value}
                  </p>
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
          ]
            .filter(Boolean)
            .join(" ")}
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
          <tr>{table.head.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
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
