import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { buildCanonicalUrl, type SeoBreadcrumbItem } from "@/shared/seo";
import { SeoJsonLd } from "../seo-json-ld/SeoJsonLd";
import styles from "./SeoBreadcrumbs.module.scss";

type SeoBreadcrumbsProps = {
  items: ReadonlyArray<SeoBreadcrumbItem>;
  currentPath?: string;
  ariaLabel?: string;
  compact?: boolean;
};

const DEFAULT_ARIA_LABEL = "Хлебные крошки";

export function SeoBreadcrumbs({
  items,
  currentPath,
  ariaLabel = DEFAULT_ARIA_LABEL,
  compact = false,
}: SeoBreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const resolvedHref = item.href ?? (index === items.length - 1 ? currentPath : undefined);

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(resolvedHref ? { item: buildCanonicalUrl(resolvedHref) } : {}),
      };
    }),
  };

  return (
    <>
      <SeoJsonLd data={schema} />
      <nav className={classNames(styles.breadcrumbs, compact && styles.compact)} aria-label={ariaLabel}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className={styles.item}>
                {renderItem({ item, isLast })}
                {!isLast ? (
                  <span className={styles.separator} aria-hidden="true">
                    ›
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

function renderItem({ item, isLast }: { item: SeoBreadcrumbItem; isLast: boolean }): ReactNode {
  if (isLast || !item.href) {
    return (
      <span className={styles.current} aria-current={isLast ? "page" : undefined}>
        {item.label}
      </span>
    );
  }

  return (
    <Link href={item.href} className={styles.link}>
      {item.label}
    </Link>
  );
}
