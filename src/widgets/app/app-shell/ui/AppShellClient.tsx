"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { LogoutButton } from "@/features/auth/ui/LogoutButton";
import { useAuthSession } from "@/shared/auth/ui/AuthSessionProvider";
import { classNames } from "@/shared/lib/classNames";
import { getUserInitials } from "@/shared/lib/user";
import { Button, SidebarPlanCard, SidebarProfileCard } from "@/shared/ui";
import { accountNavItems, mobileNavItems, primaryNavItems, type AppShellNavItem } from "../model/navigation";
import styles from "./AppShell.module.scss";

type AppShellClientProps = {
  title: string;
  subtitle: string;
  activeKey: string;
  action?: ReactNode;
  children: ReactNode;
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function AppShellClient({ title, subtitle, activeKey, action, children }: AppShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthSession();
  const pathname = usePathname();

  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeSidebar();

    if (pathname === "/app" && isPlainLeftClick(event)) {
      event.preventDefault();
      window.location.reload();
    }
  };
  const userName = user?.name?.trim() || user?.email || "Пользователь";
  const userInitials = getUserInitials(user?.name, user?.email);

  return (
    <div className={styles.surface}>
      <aside className={classNames(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
        <Link href="/app" className={styles.logo} onClick={handleLogoClick}>
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
          <SidebarProfileCard initials={userInitials} name={userName} avatarUrl={user?.avatar_url} plan="Активная сессия" />
          <LogoutButton />
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
