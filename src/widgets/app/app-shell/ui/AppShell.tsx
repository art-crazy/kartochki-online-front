"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button, SidebarPlanCard, SidebarProfileCard } from "@/shared/ui";
import { classNames } from "@/shared/lib/classNames";
import { accountNavItems, mobileNavItems, primaryNavItems, type AppShellNavItem } from "../model/navigation";
import styles from "./AppShell.module.scss";

type AppShellProps = {
  title: string;
  subtitle: string;
  activeKey: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AppShell({ title, subtitle, activeKey, action, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.surface}>
      <aside className={classNames(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
        <Link href="/" className={styles.logo} onClick={closeSidebar}>
          карточки<span>.</span>онлайн
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Главное</div>
          {primaryNavItems.map((item) => (
            <ShellLink key={item.key} item={item} active={item.key === activeKey} onNavigate={closeSidebar} />
          ))}

          <div className={styles.navSection}>Аккаунт</div>
          {accountNavItems.map((item) => (
            <ShellLink key={item.key} item={item} active={item.key === activeKey} onNavigate={closeSidebar} />
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <SidebarPlanCard />
          <SidebarProfileCard initials="ИИ" name="Иван Иванов" plan="Бесплатный план" />
        </div>
      </aside>

      <button
        type="button"
        aria-label="Закрыть меню"
        className={classNames(styles.overlay, isSidebarOpen && styles.overlayVisible)}
        onClick={closeSidebar}
      />

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLead}>
            <Button
              variant="darkOutline"
              size="sm"
              className={styles.menuToggle}
              aria-label="Открыть меню"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </Button>
            <div>
              <div className={styles.headerTitle}>{title}</div>
              <div className={styles.headerSubtitle}>{subtitle}</div>
            </div>
          </div>
          {action ? <div className={styles.headerActions}>{action}</div> : null}
        </header>

        <div className={styles.content}>{children}</div>
      </div>

      <nav className={styles.mobileNav} aria-label="Мобильная навигация">
        {mobileNavItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={classNames(styles.mobileNavItem, item.key === activeKey && styles.mobileNavItemActive)}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ShellLink({
  item,
  active,
  onNavigate,
}: {
  item: AppShellNavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link href={item.href} className={classNames(styles.navItem, active && styles.navItemActive)} onClick={onNavigate}>
      <span className={styles.navIcon}>{item.icon}</span>
      <span>{item.label}</span>
      {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
    </Link>
  );
}
