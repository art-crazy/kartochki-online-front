"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import {
  buildResultCards,
  cardCountOptions,
  cardTypeOptions,
  defaultSelectedCardTypes,
  fallbackGenerateConfigContent,
  loadingSteps,
  marketplaceOptions,
  styleOptions,
  type CardTypeId,
  type GenerateConfigContent,
  type MarketplaceId,
  type ResultCard,
  type ResultState,
  type StyleId,
} from "../model/content";
import { GenerateControls } from "./GenerateControls";
import { EmptyState, LoadingState, ResultStateView } from "./GenerateResultStates";
import styles from "./GenerateWorkspace.module.scss";

const loadingStepDurationMs = 1600;

type GenerateWorkspaceProps = {
  config?: GenerateConfigContent;
  initialMarketplace?: MarketplaceId;
  initialStyle?: StyleId;
  initialCount?: number;
  initialProjectName?: string;
};

type ToastState = {
  visible: boolean;
  message: string;
};

export function GenerateWorkspace({
  config = fallbackGenerateConfigContent,
  initialMarketplace,
  initialStyle,
  initialCount,
  initialProjectName = "",
}: GenerateWorkspaceProps) {
  const availableMarketplaces = config.marketplaces.length ? config.marketplaces : marketplaceOptions;
  const availableStyles = config.styles.length ? config.styles : styleOptions;
  const availableCardTypes = config.cardTypes.length ? config.cardTypes : cardTypeOptions;
  const availableCardCounts = config.cardCountOptions.length ? config.cardCountOptions : cardCountOptions;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const loadingTimerRef = useRef<number[]>([]);
  const toastTimerRef = useRef<number | null>(null);

  const [marketplace, setMarketplace] = useState<MarketplaceId>(
    initialMarketplace ?? availableMarketplaces[0]?.id ?? "wildberries",
  );
  const [style, setStyle] = useState<StyleId>(initialStyle ?? availableStyles[0]?.id ?? "minimal");
  const [selectedTypes, setSelectedTypes] = useState<CardTypeId[]>(getDefaultCardTypeIds(availableCardTypes));
  const [cardCount, setCardCount] = useState(initialCount ?? availableCardCounts[0] ?? 6);
  const [projectName, setProjectName] = useState(initialProjectName);
  const [resultState, setResultState] = useState<ResultState>("empty");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [generatedCards, setGeneratedCards] = useState<ResultCard[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "" });

  const nextResultCards = useMemo<ResultCard[]>(
    () => buildResultCards(selectedTypes, cardCount, availableCardTypes),
    [availableCardTypes, cardCount, selectedTypes],
  );

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
      if (!current.includes(typeId)) {
        return [...current, typeId];
      }

      return current.length === 1 ? current : current.filter((item) => item !== typeId);
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
      const timer = window.setTimeout(() => setActiveStepIndex(index), index * loadingStepDurationMs);
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
        <GenerateControls
          fileInputRef={fileInputRef}
          marketplaces={availableMarketplaces}
          styles={availableStyles}
          cardTypes={availableCardTypes}
          cardCounts={availableCardCounts}
          marketplace={marketplace}
          style={style}
          selectedTypes={selectedTypes}
          cardCount={cardCount}
          projectName={projectName}
          uploadedFileName={uploadedFileName}
          uploadedFileUrl={uploadedFileUrl}
          isDraggingFile={isDraggingFile}
          canGenerate={canGenerate}
          resultState={resultState}
          onMarketplaceChange={setMarketplace}
          onStyleChange={setStyle}
          onToggleCardType={toggleCardType}
          onCardCountChange={setCardCount}
          onProjectNameChange={setProjectName}
          onDraggingFileChange={setIsDraggingFile}
          onFileSelection={handleFileSelection}
          onGenerate={startGenerate}
        />

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

function getDefaultCardTypeIds(cardTypes: ReadonlyArray<{ id: CardTypeId; defaultSelected?: boolean }>) {
  const selected = cardTypes.filter((item) => item.defaultSelected).map((item) => item.id);

  if (selected.length) {
    return selected;
  }

  return cardTypes[0]?.id ? [cardTypes[0].id] : defaultSelectedCardTypes;
}
