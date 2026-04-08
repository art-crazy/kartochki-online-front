import { MarketingHero } from "@/widgets/marketing/hero/ui/MarketingHero";

import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <main className={styles.page}>
      <MarketingHero />
    </main>
  );
}
