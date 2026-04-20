"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import type { NavDropdownItem } from "@/shared/config/marketing";
import styles from "./NavDropdown.module.scss";

type NavDropdownProps = {
  index: number;
  label: string;
  items: NavDropdownItem["items"];
  open: boolean;
  onOpen: (index: number) => void;
  onClose: () => void;
};

export function NavDropdown({ index, label, items, open, onOpen, onClose }: NavDropdownProps) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <li ref={ref} className={styles.root}>
      <button
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => (open ? onClose() : onOpen(index))}
        onMouseEnter={() => onOpen(index)}
      >
        {label}
        <svg
          className={styles.chevron}
          data-open={open}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className={styles.menu} role="menu" onMouseLeave={onClose}>
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className={styles.menuItem}
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
