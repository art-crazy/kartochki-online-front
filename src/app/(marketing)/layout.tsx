import type { PropsWithChildren } from "react";
import styles from "./layout.module.scss";

export default function MarketingLayout({
  children,
}: PropsWithChildren) {
  return <div className={styles.surface}>{children}</div>;
}
