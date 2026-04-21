import Image from "next/image";
import Link from "next/link";
import { Badge, Button } from "@/shared/ui/primitives/Primitives";
import { heroMockupPreviews } from "@/widgets/marketing/home-hero/model/content";
import {
  marketplaceBadges,
  mockupStyleOptions,
} from "@/widgets/marketing/home/model/content";
import { homeFreePlanSummary } from "@/widgets/marketing/home/model/pricing";
import styles from "./HomeHero.module.scss";

function MarketplaceTag({ label, tone }: { label: string; tone: "wb" | "ozon" | "ym" }) {
  return <Badge tone={tone}>{label}</Badge>;
}

export function HomeHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <Badge tone="neutral" className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            ИИ-генератор карточек для маркетплейсов
          </Badge>

          <h1 className={styles.heroTitle}>
            Карточки товаров для{" "}
            <span className={styles.wb}>Wildberries,</span>{" "}
            <span className={styles.ozon}>Ozon</span>{" "}
            <span className={styles.ymConnector}>и</span>{" "}
            <span className={styles.ym}>Яндекс&nbsp;Маркет</span>{" "}
            за 30 секунд
          </h1>

          <div className={styles.heroPlatforms}>
            {marketplaceBadges.map((marketplace) => (
              <MarketplaceTag key={marketplace.label} {...marketplace} />
            ))}
          </div>

          <p className={styles.heroDescription}>
            Загрузите фото товара и получите готовый набор карточек с инфографикой, правильным фоном и текстами. Контент
            соответствует требованиям Wildberries, Ozon и Яндекс Маркет с первого раза.
          </p>

          <div className={styles.heroActions}>
            <Button as={Link} href="/auth" size="xl">
              Начать бесплатно
            </Button>
            <Button as="a" href="#how" variant="outline" size="xl">
              Как это работает
            </Button>
          </div>

          <p className={styles.heroNote}>{homeFreePlanSummary}</p>

          <div className={styles.mockupWrap}>
            <div className={styles.mockupCard}>
              <div className={styles.mockupBar}>
                <div className={styles.mockupDots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.mockupUrl}>kartochki-online.ru/generate</div>
              </div>

              <div className={styles.mockupBody}>
                <aside className={styles.mockupSidebar}>
                  <div className={styles.mockupGroup}>
                    <div className={styles.mockupLabel}>Фото товара</div>
                    <div className={styles.uploadZone}>
                      <div className={styles.uploadIcon}>↑</div>
                      <div className={styles.uploadText}>Перетащи или нажми</div>
                    </div>
                  </div>

                  <div className={styles.mockupGroup}>
                    <div className={styles.mockupLabel}>Площадка</div>
                    <div className={styles.platformRowCompact}>
                      {marketplaceBadges.map((marketplace, index) => {
                        const shortLabel = index === 0 ? "WB" : index === 1 ? "Ozon" : "Маркет";

                        return (
                          <button
                            key={marketplace.label}
                            type="button"
                            className={[
                              styles.platformToggleButton,
                              marketplace.tone === "wb" && styles.platformToggleWb,
                              marketplace.tone === "ozon" && styles.platformToggleOzon,
                              marketplace.tone === "ym" && styles.platformToggleYm,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.mockupGroup}>
                    <div className={styles.mockupLabel}>Стиль</div>
                    <div className={styles.chipRow}>
                      {mockupStyleOptions.map((style, index) => (
                        <button
                          key={style}
                          type="button"
                          className={[styles.styleChip, index === 0 && styles.styleChipActive].filter(Boolean).join(" ")}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button as={Link} href="/auth" size="lg" className={styles.mockupButton}>
                    Сгенерировать
                  </Button>
                </aside>

                <div className={styles.previewGrid}>
                  {heroMockupPreviews.map((preview, index) => (
                    <article key={preview.label} className={styles.previewCard}>
                      <Image
                        className={styles.previewImage}
                        src={preview.image}
                        alt={preview.alt}
                        fill
                        sizes="(max-width: 560px) calc(100vw - 60px), (max-width: 768px) calc((100vw - 64px) / 2), 190px"
                        priority={index === 0}
                      />
                      <span className={styles.previewLabel}>{preview.label}</span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
