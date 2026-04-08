import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { ProgressBar } from "@/shared/ui/composite/Composite";
import { Badge } from "@/shared/ui/primitives/Primitives";
import styles from "./Navigation.module.scss";

export function NavItem({
  icon,
  label,
  active = false,
  badge,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <button type="button" aria-pressed={active} className={classNames(styles.navItem, active && styles.navActive)}>
      <span>{icon}</span>
      <span>{label}</span>
      {badge ? (
        <span className={styles.navBadge}>
          <Badge tone="accent">{badge}</Badge>
        </span>
      ) : null}
    </button>
  );
}

export function SidebarPlanCard({ href = "/app" }: { href?: string }) {
  return (
    <div className={styles.sidebarPlan}>
      <div className={styles.sidebarPlanLabel}>Бесплатный план</div>
      <div className={styles.sidebarPlanUsage}>7 из 10 карточек</div>
      <ProgressBar dark label="Лимит" value={7} max={10} />
      <Link href={href} className={styles.sidebarPlanLink}>
        Перейти на Pro →
      </Link>
    </div>
  );
}

export function Avatar({
  initials,
  size = "md",
  gradient = 1,
}: {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: 1 | 2 | 3;
}) {
  return (
    <div
      className={classNames(
        styles.avatar,
        size === "sm" && styles.avatarSm,
        size === "md" && styles.avatarMd,
        size === "lg" && styles.avatarLg,
        size === "xl" && styles.avatarXl,
        gradient === 1 && styles.avatarGradient1,
        gradient === 2 && styles.avatarGradient2,
        gradient === 3 && styles.avatarGradient3,
      )}
    >
      {initials}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: ReadonlyArray<string> }) {
  return (
    <div className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <span key={item} className={index === items.length - 1 ? styles.breadcrumbCurrent : undefined}>
          {item}
          {index < items.length - 1 ? " ›" : ""}
        </span>
      ))}
    </div>
  );
}

export function MobileBottomNav({
  items,
  activeLabel,
}: {
  items: ReadonlyArray<{ icon: ReactNode; label: string }>;
  activeLabel: string;
}) {
  return (
    <div className={styles.mobileNav}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-pressed={item.label === activeLabel}
          className={classNames(styles.mobileNavItem, item.label === activeLabel && styles.mobileNavItemActive)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
