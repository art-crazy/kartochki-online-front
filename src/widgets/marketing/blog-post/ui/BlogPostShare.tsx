"use client";

import { useState } from "react";
import styles from "./BlogPost.module.scss";

type BlogPostShareProps = {
  url: string;
  title: string;
};

export function BlogPostShare({ url, title }: BlogPostShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.shareActions}>
      <button type="button" className={styles.shareButton} onClick={handleCopy} aria-label="Скопировать ссылку">
        {copied ? "✓" : "🔗"}
      </button>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        className={styles.shareButton}
        aria-label="Поделиться в Telegram"
      >
        ✈
      </a>
    </div>
  );
}
