"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { NavItem } from "@/shared/config/marketing";
import { NavDropdown } from "./NavDropdown";
import styles from "./SiteHeader.module.scss";

type NavLinksProps = {
  nav: readonly NavItem[];
};

export function NavLinks({ nav }: NavLinksProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpen = useCallback((index: number) => setActiveIndex(index), []);
  const handleClose = useCallback(() => setActiveIndex(null), []);

  return (
    <ul className={styles.navLinks}>
      {nav.map((item, index) => {
        if (item.type === "dropdown") {
          return (
            <NavDropdown
              key={item.label}
              index={index}
              label={item.label}
              items={item.items}
              open={activeIndex === index}
              onOpen={handleOpen}
              onClose={handleClose}
            />
          );
        }
        return (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
