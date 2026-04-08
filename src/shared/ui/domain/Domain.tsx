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
      <Badge tone="wb" className={styles.marketplaceBadge}>
        <span className={[styles.badgeDot, styles.badgeDotWb].join(" ")} />
        Wildberries
      </Badge>
      <span className={styles.separator}>·</span>
      <Badge tone="ozon" className={styles.marketplaceBadge}>
        <span className={[styles.badgeDot, styles.badgeDotOzon].join(" ")} />
        Ozon
      </Badge>
      <span className={styles.separator}>·</span>
      <Badge tone="ym" className={styles.marketplaceBadge}>
        <span className={[styles.badgeDot, styles.badgeDotYm].join(" ")} />
        Яндекс Маркет
      </Badge>
    </div>
  );
}

export function GenerateCtaBanner() {
  return (
    <div className={styles.generateBanner}>
      <div className={styles.generateGlow} />
      <div className={styles.generateBody}>
        <div className={styles.generateTitle}>Устал делать карточки вручную?</div>
        <div className={styles.generateText}>Загрузи фото — сервис сделает карточки для WB, Ozon и Яндекс Маркет за 30 секунд</div>
      </div>
      <Button variant="primary" className={styles.generateButton}>
        Попробовать →
      </Button>
    </div>
  );
}
