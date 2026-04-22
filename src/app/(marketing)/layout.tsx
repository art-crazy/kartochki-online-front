import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { buildIndexRobots } from "@/shared/seo";
import { CookieConsentBanner } from "@/widgets/marketing/cookie-consent";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  robots: buildIndexRobots(),
};

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.surface} data-scrollbar-theme="marketing">
      {children}
      <CookieConsentBanner />
    </div>
  );
}
