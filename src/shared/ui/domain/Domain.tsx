import { Button, Badge } from "@/shared/ui/primitives/Primitives";
import styles from "./Domain.module.scss";

export function HeroBadge({ text }: { text: string }) {
  return (
    <div className={styles.heroBadge}>
      <span className={styles.heroBadgeDot} />
      <span>{text}</span>
    </div>
  );
}

export function MarketplaceBadgeRow() {
  return (
    <div className={styles.marketplaceRow}>
      <Badge tone="wb">● Wildberries</Badge>
      <span className={styles.separator}>·</span>
      <Badge tone="ozon">● Ozon</Badge>
      <span className={styles.separator}>·</span>
      <Badge tone="ym">● Яндекс Маркет</Badge>
    </div>
  );
}

export function GenerateCtaBanner() {
  return (
    <div className={styles.generateBanner}>
      <div className={styles.generateGlow} />
      <div className={styles.generateBody}>
        <div className={styles.generateTitle}>Устал делать карточки вручную?</div>
        <div className={styles.generateText}>
          Загрузи фото, а сервис соберёт карточки для Wildberries, Ozon и Яндекс Маркета за 30 секунд.
        </div>
      </div>
      <Button variant="primary">Попробовать →</Button>
    </div>
  );
}
