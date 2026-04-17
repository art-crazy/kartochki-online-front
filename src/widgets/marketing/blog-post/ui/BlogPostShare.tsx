"use client";

import { useEffect, useRef, useState } from "react";
import { CopyLinkIcon, ShareArrowIcon, SuccessCheckIcon } from "@/shared/ui";
import styles from "./BlogPost.module.scss";

type BlogPostShareProps = {
  url: string;
  title: string;
};

function useTemporaryFlag(duration = 2000) {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const trigger = () => {
    setActive(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setActive(false);
      timeoutRef.current = undefined;
    }, duration);
  };

  const reset = () => {
    setActive(false);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  return { active, trigger, reset };
}

export function BlogPostShare({ url, title }: BlogPostShareProps) {
  const copiedState = useTemporaryFlag();
  const sharedState = useTemporaryFlag();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      copiedState.trigger();
    } catch {
      copiedState.reset();
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }

      sharedState.trigger();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      sharedState.reset();
    }
  };

  return (
    <div className={styles.shareActions}>
      <button type="button" className={styles.shareButton} onClick={handleCopy} aria-label="Скопировать ссылку">
        {copiedState.active ? <SuccessCheckIcon /> : <CopyLinkIcon />}
      </button>
      <button type="button" className={styles.shareButton} onClick={handleShare} aria-label="Поделиться">
        {sharedState.active ? <SuccessCheckIcon /> : <ShareArrowIcon />}
      </button>
    </div>
  );
}
