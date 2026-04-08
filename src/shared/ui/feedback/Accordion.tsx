"use client";

import { useState } from "react";
import styles from "./Feedback.module.scss";

export function Accordion({
  items,
}: {
  items: ReadonlyArray<{ title: string; content: string }>;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <div key={item.title} className={styles.accordionItem}>
            <button
              type="button"
              aria-expanded={isOpen}
              className={styles.accordionTrigger}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.title}</span>
              <span>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <div className={styles.accordionBody}>{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
