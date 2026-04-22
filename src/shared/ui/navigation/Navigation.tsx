import Link from "next/link";
import { Fragment } from "react";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
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
      <span className={styles.navItemIcon}>{icon}</span>
      <span>{label}</span>
      {badge ? <span className={styles.navItemBadge}>{badge}</span> : null}
    </button>
  );
}

export function SidebarPlanCard({
  href = "/app",
  label = "Бесплатный план",
  usage,
  progress = 0,
  actionLabel = "Перейти на Pro →",
}: {
  href?: string;
  label?: string;
  usage?: string;
  progress?: number;
  actionLabel?: string;
}) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={styles.sidebarPlan}>
      <div className={styles.sidebarPlanLabel}>{label}</div>
      {usage ? <div className={styles.sidebarPlanUsage}>{usage}</div> : null}
      <div className={styles.sidebarPlanBar} aria-hidden="true">
        <div className={styles.sidebarPlanFill} style={{ width: `${safeProgress}%` }} />
      </div>
      <Link href={href} className={styles.sidebarPlanLink}>
        {actionLabel}
      </Link>
    </div>
  );
}

export function SidebarProfileCard({
  initials,
  name,
  plan,
  avatarUrl,
  gradient = 1,
}: {
  initials: string;
  name: string;
  plan?: string;
  avatarUrl?: string | null;
  gradient?: 1 | 2 | 3;
}) {
  return (
    <div className={styles.sidebarProfile}>
      <Avatar initials={initials} src={avatarUrl} alt={name} size="md" gradient={gradient} />
      <div className={styles.sidebarProfileBody}>
        <div className={styles.sidebarProfileName}>{name}</div>
        {plan ? <div className={styles.sidebarProfilePlan}>{plan}</div> : null}
      </div>
    </div>
  );
}

export function Avatar({
  initials,
  src,
  alt = "",
  size = "md",
  gradient = 1,
}: {
  initials: string;
  src?: string | null;
  alt?: string;
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
      {src ? (
        // OAuth avatar hosts are provider-controlled, so Next image allow-listing is not practical here.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.avatarImage} src={src} alt={alt} />
      ) : (
        initials
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: ReadonlyArray<string> }) {
  return (
    <div className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <Fragment key={item}>
          {index === items.length - 1 ? (
            <span className={styles.breadcrumbCurrent}>{item}</span>
          ) : (
            <Link href="#" className={styles.breadcrumbLink}>
              {item}
            </Link>
          )}
          {index < items.length - 1 ? <span className={styles.breadcrumbSeparator}>›</span> : null}
        </Fragment>
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
          <span className={styles.mobileNavIcon}>{item.icon}</span>
          <span className={styles.mobileNavLabel}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
