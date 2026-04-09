"use client";

import { useState } from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./Feedback.module.scss";

export function Accordion({
  items,
  theme = "light",
}: {
  items: ReadonlyArray<{ title: string; content: string }>;
  theme?: "light" | "dark";
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={classNames(styles.accordion, theme === "dark" && styles.accordionDark)}>
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <div
            key={item.title}
            className={[styles.accordionItem, isOpen && styles.accordionItemOpen].filter(Boolean).join(" ")}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              className={styles.accordionTrigger}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className={styles.accordionTitle}>{item.title}</span>
              <span className={[styles.accordionIcon, isOpen && styles.accordionIconOpen].filter(Boolean).join(" ")}>
                +
              </span>
            </button>
            <div className={styles.accordionBody}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}
