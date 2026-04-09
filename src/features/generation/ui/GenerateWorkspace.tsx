"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Chip, Input } from "@/shared/ui";
import {
  buildResultCards,
  cardCountOptions,
  cardTypeOptions,
  defaultSelectedCardTypes,
  loadingSteps,
  marketplaceOptions,
  styleOptions,
  type CardTypeId,
  type LoadingStep,
  type MarketplaceId,
  type ResultCard,
  type ResultState,
  type StyleId,
} from "../model/content";
import styles from "./GenerateWorkspace.module.scss";

const loadingStepDurationMs = 1600;

type GenerateWorkspaceProps = {
  initialMarketplace?: MarketplaceId;
  initialStyle?: StyleId;
  initialCount?: (typeof cardCountOptions)[number];
  initialProjectName?: string;
};

type ToastState = {
  visible: boolean;
  message: string;
};

export function GenerateWorkspace({
  initialMarketplace = "wildberries",
  initialStyle = "minimal",
  initialCount = 6,
  initialProjectName = "",
}: GenerateWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const loadingTimerRef = useRef<number[]>([]);
  const toastTimerRef = useRef<number | null>(null);

  const [marketplace, setMarketplace] = useState<MarketplaceId>(initialMarketplace);
  const [style, setStyle] = useState<StyleId>(initialStyle);
  const [selectedTypes, setSelectedTypes] = useState<CardTypeId[]>(defaultSelectedCardTypes);
  const [cardCount, setCardCount] = useState<(typeof cardCountOptions)[number]>(initialCount);
  const [projectName, setProjectName] = useState(initialProjectName);
  const [resultState, setResultState] = useState<ResultState>("empty");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [generatedCards, setGeneratedCards] = useState<ResultCard[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "" });

  const nextResultCards = useMemo<ResultCard[]>(() => buildResultCards(selectedTypes, cardCount), [cardCount, selectedTypes]);

  const activeLoadingStep = loadingSteps[Math.min(activeStepIndex, loadingSteps.length - 1)];
  const canGenerate = Boolean(uploadedFileUrl) && resultState !== "loading";
  const resultsTitle =
    resultState === "result"
      ? `${generatedCards.length} карточек готовы`
      : resultState === "loading"
        ? "Генерация..."
        : "Результат появится здесь";

  useEffect(() => {
    return () => {
      loadingTimerRef.current.forEach((timer) => window.clearTimeout(timer));

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message: string) {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ visible: true, message });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
      toastTimerRef.current = null;
    }, 2500);
  }

  function updatePreview(file: File) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setUploadedFileUrl(nextUrl);
    setUploadedFileName(file.name);
  }

  function handleFileSelection(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Нужен файл изображения");
      return;
    }

    updatePreview(file);
  }

  function toggleCardType(typeId: CardTypeId) {
    setSelectedTypes((current) => {
      if (current.includes(typeId)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== typeId);
      }

      return [...current, typeId];
    });
  }

  function startGenerate() {
    if (!uploadedFileUrl) {
      showToast("Сначала загрузите фото товара");
      return;
    }

    const cardsSnapshot = nextResultCards;

    setResultState("loading");
    setActiveStepIndex(0);

    loadingTimerRef.current.forEach((timer) => window.clearTimeout(timer));
    loadingTimerRef.current = [];

    loadingSteps.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setActiveStepIndex(index);
      }, index * loadingStepDurationMs);

      loadingTimerRef.current.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      setActiveStepIndex(loadingSteps.length - 1);
      setGeneratedCards(cardsSnapshot);
      setResultState("result");
      showToast("Карточки готовы к скачиванию");
    }, loadingSteps.length * loadingStepDurationMs + 300);

    loadingTimerRef.current.push(finishTimer);
  }

  return (
    <>
      <section className={styles.workspace}>
        <form className={styles.leftPanel} onSubmit={(event) => event.preventDefault()}>
          <section className={styles.section}>
            <h2 className={styles.label}>Фото товара</h2>
            <button
              type="button"
              className={[
                styles.uploadZone,
                isDraggingFile ? styles.uploadZoneDragging : "",
                uploadedFileUrl ? styles.uploadZoneReady : "",
              ].join(" ")}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDraggingFile(false);
                handleFileSelection(event.dataTransfer.files[0] ?? null);
              }}
            >
              {uploadedFileUrl ? (
                <div className={styles.uploadPreview}>
                  <div className={styles.previewImageWrap}>
                    <Image src={uploadedFileUrl} alt="" width={80} height={80} unoptimized className={styles.previewImage} />
                  </div>
                  <div className={styles.previewFileName}>{shortenName(uploadedFileName)}</div>
                  <div className={styles.previewAction}>Заменить фото</div>
                </div>
              ) : (
                <div className={styles.uploadDefault}>
                  <span className={styles.uploadIcon}>↑</span>
                  <div className={styles.uploadTitle}>Перетащи или нажми</div>
                  <div className={styles.uploadSub}>JPG, PNG до 10 МБ</div>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={(event) => handleFileSelection(event.target.files?.[0] ?? null)}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>Площадка</h2>
            <div className={styles.marketplaceGrid}>
              {marketplaceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={[styles.marketplaceButton, marketplace === option.id ? styles.marketplaceButtonActive : ""].join(
                    " ",
                  )}
                  onClick={() => setMarketplace(option.id)}
                >
                  <span className={styles.marketplaceDot} style={{ color: option.dot }}>
                    ●
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>Стиль</h2>
            <div className={styles.chips}>
              {styleOptions.map((option) => (
                <Chip key={option.id} dark selected={style === option.id} onClick={() => setStyle(option.id)}>
                  {option.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>Типы карточек</h2>
            <div className={styles.chips}>
              {cardTypeOptions.map((option) => (
                <Chip
                  key={option.id}
                  dark
                  accentSelected
                  selected={selectedTypes.includes(option.id)}
                  onClick={() => toggleCardType(option.id)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.label}>Количество карточек</h2>
            <div className={styles.countSelector}>
              {cardCountOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={[styles.countButton, cardCount === option ? styles.countButtonActive : ""].join(" ")}
                  onClick={() => setCardCount(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <Input
            dark
            label="Название проекта"
            placeholder="Например: Кроссовки Nike"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />

          <Button
            variant="darkPrimary"
            size="lg"
            block
            className={styles.generateButton}
            disabled={!canGenerate}
            onClick={startGenerate}
          >
            {resultState === "result" ? "⚡ Сгенерировать ещё" : "⚡ Сгенерировать карточки"}
          </Button>
        </form>

        <section className={styles.rightPanel}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsTitle} aria-live="polite">
              {resultsTitle}
            </div>
            {resultState === "result" ? (
              <div className={styles.resultsActions}>
                <Button variant="darkOutline" size="sm" onClick={() => showToast("Сохранено в проекты")}>
                  ◫ Сохранить
                </Button>
                <Button variant="primary" size="sm" onClick={() => showToast("Скачиваем ZIP...")}>
                  ↓ Скачать все
                </Button>
              </div>
            ) : null}
          </div>

          <div className={styles.resultsBody}>
            {resultState === "empty" ? <EmptyState /> : null}
            {resultState === "loading" ? <LoadingState activeStep={activeLoadingStep} activeStepIndex={activeStepIndex} /> : null}
            {resultState === "result" ? <ResultStateView cards={generatedCards} onDownload={showToast} /> : null}
          </div>
        </section>
      </section>

      <div className={[styles.toast, toast.visible ? styles.toastVisible : ""].join(" ")} role="status" aria-live="polite">
        <span className={styles.toastDot} />
        <span>{toast.message}</span>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyVisual} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.emptyThumb} />
        ))}
      </div>
      <div className={styles.emptyTitle}>Карточки ещё не созданы</div>
      <div className={styles.emptyText}>Загрузи фото товара и нажми «Сгенерировать» — готовый сет появится здесь</div>
    </div>
  );
}

function LoadingState({
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

function ResultStateView({
  cards,
  onDownload,
}: {
  cards: ReadonlyArray<ResultCard>;
  onDownload: (message: string) => void;
}) {
  return (
    <div className={styles.resultState}>
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <article key={card.id} className={styles.resultCard}>
            <div className={styles.cardVisual}>
              <div className={styles.cardVisualInner} style={{ background: card.background }}>
                <div className={styles.cardBadge} style={{ color: card.accent }}>
                  {card.label}
                </div>
              </div>
              <div className={styles.cardOverlay}>
                <Button variant="secondary" size="sm" onClick={() => onDownload("Скачиваем...")}>
                  ↓ Скачать
                </Button>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.cardLabel}>{card.label}</span>
              <button type="button" className={styles.cardDownload} onClick={() => onDownload("Скачиваем...")}>
                ↓
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function shortenName(fileName: string) {
  return fileName.length > 20 ? `${fileName.slice(0, 18)}...` : fileName;
}
