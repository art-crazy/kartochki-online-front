"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "@/features/auth/model/useLogout";
import type { AuthUser } from "@/shared/api";
import { getUserInitials } from "@/shared/lib/user";
import { ChevronDownIcon, GridIcon, LogoutIcon, PlusIcon, SettingsIcon } from "@/shared/ui/icons/MenuIcons";
import { Avatar } from "@/shared/ui/navigation/Navigation";
import styles from "./SiteHeaderUserMenu.module.scss";

type MenuItem = {
  label: string;
  href: string;
  Icon: React.FC;
};

const menuItems: MenuItem[] = [
  { label: "Мои проекты", href: "/app/projects", Icon: GridIcon },
  { label: "Создать карточку", href: "/app/generate", Icon: PlusIcon },
  { label: "Настройки", href: "/app/settings", Icon: SettingsIcon },
];

type SiteHeaderUserMenuProps = {
  user: AuthUser;
};

export function SiteHeaderUserMenu({ user }: SiteHeaderUserMenuProps) {
  const { logout, isPending } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = user.name?.trim() || user.email || "Личный кабинет";
  const userInitials = getUserInitials(user.name, user.email) || "KO";

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.root} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Меню пользователя: ${userName}`}
      >
        <Avatar initials={userInitials} src={user.avatar_url} alt={userName} size="sm" gradient={1} />
        <span className={styles.profileName}>{userName}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownEmail}>{user.email}</span>
          </div>

          <div className={styles.dropdownItems}>
            {menuItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </div>

          <div className={styles.dropdownDivider} />

          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.logoutButton}
              role="menuitem"
              disabled={isPending}
              onClick={() => void logout()}
            >
              <LogoutIcon />
              {isPending ? "Выход…" : "Выйти"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
