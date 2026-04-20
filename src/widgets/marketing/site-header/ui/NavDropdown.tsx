"use client";

import { useRef, useEffect } from "react";
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
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (!closeTimerRef.current) return;

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(onClose, 120);
  };

  useEffect(() => {
    if (!open) return;

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
  }, [onClose, open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <li ref={ref} className={styles.root} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => (open ? onClose() : onOpen(index))}
        onMouseEnter={() => {
          clearCloseTimer();
          onOpen(index);
        }}
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
        <ul className={styles.menu} role="menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {items.map((item) => (
            <li key={item.href} role="none">
              <a href={item.href} role="menuitem" className={styles.menuItem}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
