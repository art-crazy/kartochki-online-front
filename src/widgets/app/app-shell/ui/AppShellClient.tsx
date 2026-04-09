"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button, SidebarPlanCard, SidebarProfileCard } from "@/shared/ui";
import { classNames } from "@/shared/lib/classNames";
import { accountNavItems, mobileNavItems, primaryNavItems, type AppShellNavItem } from "../model/navigation";
import styles from "./AppShell.module.scss";

type AppShellClientProps = {
  title: string;
  subtitle: string;
  activeKey: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AppShellClient({ title, subtitle, activeKey, action, children }: AppShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.surface}>
      <aside className={classNames(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
        <Link href="/" className={styles.logo} onClick={closeSidebar}>
          РєР°СЂС‚РѕС‡РєРё<span>.</span>РѕРЅР»Р°Р№РЅ
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Р“Р»Р°РІРЅРѕРµ</div>
          {primaryNavItems.map((item) => (
            <ShellLink key={item.key} item={item} active={item.key === activeKey} onNavigate={closeSidebar} />
          ))}

          <div className={styles.navSection}>РђРєРєР°СѓРЅС‚</div>
          {accountNavItems.map((item) => (
            <ShellLink key={item.key} item={item} active={item.key === activeKey} onNavigate={closeSidebar} />
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <SidebarPlanCard />
          <SidebarProfileCard initials="РР" name="РРІР°РЅ РРІР°РЅРѕРІ" plan="Р‘РµСЃРїР»Р°С‚РЅС‹Р№ РїР»Р°РЅ" />
        </div>
      </aside>

      <button
        type="button"
        aria-label="Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ"
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
              aria-label="РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ"
              onClick={() => setIsSidebarOpen(true)}
            >
              в°
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

      <nav className={styles.mobileNav} aria-label="РњРѕР±РёР»СЊРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ">
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
