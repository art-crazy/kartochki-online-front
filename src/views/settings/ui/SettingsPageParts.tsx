import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { CardSurface } from "@/shared/ui";
import styles from "./SettingsPage.module.scss";

export function SettingsCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <CardSurface theme="dark" className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardSubtitle}>{subtitle}</p>
      </header>
      <div className={styles.cardBody}>{children}</div>
    </CardSurface>
  );
}

export function SettingsStatus({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.statusCard}>
      <h2 className={styles.statusTitle}>{title}</h2>
      <p className={styles.statusText}>{description}</p>
      {action ? <div className={styles.statusAction}>{action}</div> : null}
    </CardSurface>
  );
}

export function SwitchRow({
  checked,
  description,
  disabled,
  onToggle,
  title,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  onToggle: () => void;
  title: string;
}) {
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchCopy}>
        <div className={styles.listTitle}>{title}</div>
        <div className={styles.listMetaMuted}>{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        className={classNames(styles.switchControl, checked && styles.switchControlOn)}
        onClick={onToggle}
      >
        <span className={styles.switchKnob} />
      </button>
    </div>
  );
}
