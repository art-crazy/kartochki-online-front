import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "../primitives/Primitives";
import landing from "./LandingPage.module.scss";
import styles from "./MarketingGlowCta.module.scss";

type MarketingGlowCtaProps = {
  title: ReactNode;
  description: ReactNode;
  buttonLabel: ReactNode;
  href?: string;
};

export function MarketingGlowCta({
  title,
  description,
  buttonLabel,
  href = "/auth",
}: MarketingGlowCtaProps) {
  return (
    <section className={styles.section}>
      <div className={landing.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>
          <Button as={Link} href={href} size="xl" className={styles.button}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
