import Link from "next/link";
import { buildItemListSchema, type SeoLinkGroup } from "@/shared/seo";
import { SeoJsonLd } from "../seo-json-ld/SeoJsonLd";
import styles from "./SeoLinkSection.module.scss";

type SeoLinkSectionProps = {
  title: string;
  groups: readonly SeoLinkGroup[];
  eyebrow?: string;
  intro?: string;
};

export function SeoLinkSection({ title, groups, eyebrow, intro }: SeoLinkSectionProps) {
  if (groups.length === 0) {
    return null;
  }

  const itemListSchema = buildItemListSchema(
    title,
    groups.flatMap((group) => group.links),
  );

  return (
    <section className={styles.section} aria-label={title}>
      <SeoJsonLd data={itemListSchema} />
      <div className={styles.surface}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
        <h2 className={styles.title}>{title}</h2>
        {intro ? <p className={styles.intro}>{intro}</p> : null}

        <div className={styles.groups}>
          {groups.map((group) => (
            <nav key={group.title} className={styles.group} aria-label={group.title}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <div className={styles.linkList}>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.linkItem}>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <p className={styles.linkDescription}>{link.description}</p>
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
}
