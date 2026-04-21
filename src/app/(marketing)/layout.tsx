import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { buildIndexRobots } from "@/shared/seo";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  robots: buildIndexRobots(),
};

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.surface} data-scrollbar-theme="marketing">
      {children}
    </div>
  );
}
