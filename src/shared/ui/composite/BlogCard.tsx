import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { CardSurface } from "./CardSurface";
import styles from "./Composite.module.scss";

type BlogCardProps = {
  title: string;
  meta: string;
  tag: ReactNode;
  gradient: string;
  image?: StaticImageData;
  imageAlt?: string;
  href?: string;
};

export function BlogCard({ title, meta, tag, gradient, image, imageAlt, href }: BlogCardProps) {
  const content = (
    <CardSurface className={styles.blogCard}>
      <div className={styles.blogVisual} style={{ background: gradient }}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="(max-width: 900px) calc(100vw - 24px), 360px"
            className={styles.blogImage}
          />
        ) : null}
        {tag}
      </div>
      <div className={styles.blogBody}>
        <div className={styles.blogTitle}>{title}</div>
        <div className={styles.blogMeta}>
          <span>{meta}</span>
          <span className={styles.blogRead}>Читать →</span>
        </div>
      </div>
    </CardSurface>
  );

  return href ? (
    <Link href={href} className={styles.blogCardLink}>
      {content}
    </Link>
  ) : (
    content
  );
}
