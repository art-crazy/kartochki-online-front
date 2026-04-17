import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { siteConfig } from "@/shared/config/site";
import styles from "./SeoBreadcrumbs.module.scss";

export type SeoBreadcrumbItem = {
  label: string;
  href?: string;
};

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
        ...(resolvedHref ? { item: toAbsoluteUrl(resolvedHref) } : {}),
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
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

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteConfig.defaultUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
