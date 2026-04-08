"use client";

import { useEffect } from "react";

export function BlogPostEnhancements() {
  useEffect(() => {
    const article = document.getElementById("blog-post-article");
    const progress = document.getElementById("read-progress");
    const tocItems = Array.from(document.querySelectorAll<HTMLElement>("[data-toc-item]"));

    if (!article || !progress) {
      return;
    }

    const headings = Array.from(article.querySelectorAll<HTMLElement>("h2[id], h3[id]"));

    const update = () => {
      const rect = article.getBoundingClientRect();
      const totalScrollable = Math.max(article.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.max(0, -rect.top);
      const progressValue = Math.min(100, (scrolled / totalScrollable) * 100);

      progress.style.width = `${progressValue}%`;

      let activeId = headings[0]?.id ?? "";

      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= 140) {
          activeId = heading.id;
        }
      });

      tocItems.forEach((item) => {
        const isActive = item.dataset.tocItem === activeId;
        item.dataset.active = isActive ? "true" : "false";

        const link = item.querySelector("a");

        if (!link) {
          return;
        }

        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
