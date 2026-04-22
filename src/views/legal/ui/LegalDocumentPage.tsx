import Link from "next/link";
import { blogHeaderNav, legalFooterColumns } from "@/shared/config/marketing";
import type { LegalDocument } from "../model/types";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import styles from "./LegalDocumentPage.module.scss";

type LegalDocumentPageProps = {
  document: LegalDocument;
};

export function LegalDocumentPage({ document }: LegalDocumentPageProps) {
  return (
    <div className={styles.page}>
      <SiteHeader nav={blogHeaderNav} />

      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>{document.eyebrow}</div>
          <h1 className={styles.title}>{document.title}</h1>
        </header>

        <div className={styles.layout}>
          <article className={styles.content}>
            {document.sections.map((section) => {
              const sectionId = buildSectionId(section.title);

              return (
                <section key={section.title} className={styles.section} aria-labelledby={sectionId}>
                  <h2 id={sectionId} className={styles.sectionTitle}>
                  {section.title}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))}

                  {section.items?.length ? (
                    <ul className={styles.list}>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </article>

          <aside className={styles.aside}>
            {document.relatedLinks?.length ? (
              <section className={styles.asideCard}>
                <h2 className={styles.asideTitle}>Другие документы</h2>
                <div className={styles.linkList}>
                  {document.relatedLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>

      <SiteFooter columns={legalFooterColumns} />
    </div>
  );
}

function buildSectionId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
