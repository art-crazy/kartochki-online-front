import Link from "next/link";
import { blogPost, relatedPosts } from "@/entities/blog/model/content";
import { blogFooterLinks, blogHeaderLinks } from "@/shared/config/marketing";
import { Button } from "@/shared/ui/primitives/Primitives";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import styles from "./BlogPage.module.scss";

export function BlogPage() {
  return (
    <main className={styles.page}>
      <SiteHeader links={blogHeaderLinks} />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.kicker}>Блог</p>
          <h1 className={styles.title}>Материалы для продавцов на маркетплейсах</h1>
          <p className={styles.description}>
            Практические гайды по карточкам товаров, инфографике, требованиям площадок и росту конверсии.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <article className={styles.featuredCard}>
            <div className={styles.featuredBody}>
              <p className={styles.cardLabel}>Новая статья</p>
              <h2 className={styles.cardTitle}>{blogPost.title}</h2>
              <p className={styles.cardDescription}>{blogPost.excerpt}</p>
              <div className={styles.cardMeta}>
                {blogPost.publishedLabel} · {blogPost.readingTime} чтения
              </div>
              <Button as={Link} href={blogPost.canonicalPath} size="lg">
                Читать статью
              </Button>
            </div>
            <div className={styles.featuredVisual} aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ещё материалы</h2>
          <div className={styles.grid}>
            {relatedPosts.map((post) => (
              <article key={post.title} className={styles.card}>
                <div className={styles.cardVisual} style={{ background: post.gradient }} />
                <div className={styles.cardContent}>
                  <div className={styles.cardTag}>{post.tag}</div>
                  <div className={styles.cardName}>{post.title}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter links={blogFooterLinks} />
    </main>
  );
}
