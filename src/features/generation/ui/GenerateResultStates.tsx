"use client";

import Image from "next/image";
import { Button } from "@/shared/ui";
import { loadingSteps, type LoadingStep, type ResultCard } from "../model/content";
import styles from "./GenerateWorkspace.module.scss";

export function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyVisual} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.emptyThumb} />
        ))}
      </div>
      <div className={styles.emptyTitle}>Карточки еще не созданы</div>
      <div className={styles.emptyText}>Загрузите фото товара и нажмите «Сгенерировать» - готовый сет появится здесь</div>
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className={styles.emptyState} role="alert">
      <div className={styles.emptyVisual} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.emptyThumb} />
        ))}
      </div>
      <div className={styles.emptyTitle}>Не удалось сгенерировать карточки</div>
      <div className={styles.emptyText}>{message || "Попробуйте запустить генерацию еще раз"}</div>
    </div>
  );
}

export function LoadingState({
  activeStep,
  activeStepIndex,
}: {
  activeStep: LoadingStep;
  activeStepIndex: number;
}) {
  return (
    <div className={styles.loadingState} aria-live="polite" aria-busy="true">
      <div className={styles.loadingRing} aria-hidden="true" />
      <div className={styles.loadingText}>
        <div className={styles.loadingTitle}>{activeStep.title}</div>
        <div className={styles.loadingSub}>{activeStep.description}</div>
      </div>
      <div className={styles.loadingSteps}>
        {loadingSteps.map((step, index) => {
          const status = index < activeStepIndex ? "done" : index === activeStepIndex ? "active" : "idle";

          return (
            <div
              key={step.id}
              className={[
                styles.loadingStep,
                status === "done" ? styles.loadingStepDone : "",
                status === "active" ? styles.loadingStepActive : "",
              ].join(" ")}
            >
              <div className={styles.stepDot}>{status === "done" ? "✓" : index + 1}</div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.skeletonGrid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard} />
        ))}
      </div>
    </div>
  );
}

export function ResultStateView({
  cards,
  onDownload,
}: {
  cards: ReadonlyArray<ResultCard>;
  onDownload: (card: ResultCard) => void;
}) {
  return (
    <div className={styles.resultState}>
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <article key={card.id} className={styles.resultCard}>
            <div className={styles.cardVisual}>
              <div className={styles.cardVisualInner} style={{ background: card.background }}>
                {card.previewUrl ? (
                  <Image src={card.previewUrl} alt="" fill sizes="180px" unoptimized className={styles.cardImage} />
                ) : null}
                <div className={styles.cardBadge} style={{ color: card.accent }}>
                  {card.label}
                </div>
              </div>
              <div className={styles.cardOverlay}>
                <Button variant="secondary" size="sm" onClick={() => onDownload(card)}>
                  ↓ Скачать
                </Button>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.cardLabel}>{card.label}</span>
              <button type="button" className={styles.cardDownload} onClick={() => onDownload(card)}>
                ↓
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
