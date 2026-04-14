"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import { useGenerationFlow } from "../model/useGenerationFlow";
import {
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
  type StyleId,
} from "../model/content";
import { GenerateControls } from "./GenerateControls";
import { EmptyState, ErrorState, LoadingState, ResultStateView } from "./GenerateResultStates";
import styles from "./GenerateWorkspace.module.scss";

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
  const toastTimerRef = useRef<number | null>(null);

  const [marketplace, setMarketplace] = useState<MarketplaceId>(
    initialMarketplace ?? availableMarketplaces[0]?.id ?? "wildberries",
  );
  const [style, setStyle] = useState<StyleId>(initialStyle ?? availableStyles[0]?.id ?? "minimal");
  const [selectedTypes, setSelectedTypes] = useState<CardTypeId[]>(getDefaultCardTypeIds(availableCardTypes));
  const [cardCount, setCardCount] = useState(initialCount ?? availableCardCounts[0] ?? 6);
  const [projectName, setProjectName] = useState(initialProjectName);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "" });

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ visible: true, message });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
      toastTimerRef.current = null;
    }, 2500);
  }, []);

  const generationFlow = useGenerationFlow({
    availableCardTypes,
    cardCount,
    marketplace,
    projectName,
    selectedTypes,
    showToast,
    style,
    uploadedFileUrl,
  });

  const { activeStepIndex, canGenerate, effectiveResultState, generatedCards, generationStatus } = generationFlow;
  const activeLoadingStep = loadingSteps[Math.min(activeStepIndex, loadingSteps.length - 1)];
  const resultsTitle =
    effectiveResultState === "result"
      ? `${generatedCards.length} карточек готовы`
      : effectiveResultState === "loading"
        ? "Генерация..."
        : effectiveResultState === "error"
          ? "Генерация не удалась"
          : "Результат появится здесь";

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
    generationFlow.uploadImage(file);
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
    generationFlow.startGeneration(getDefaultCardTypeIds(availableCardTypes));
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
          resultState={effectiveResultState}
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
            {effectiveResultState === "result" ? (
              <div className={styles.resultsActions}>
                <Button variant="primary" size="sm" onClick={() => downloadArchive(generationStatus?.archive_download_url, showToast)}>
                  ↓ Скачать все
                </Button>
              </div>
            ) : null}
          </div>

          <div className={styles.resultsBody}>
            {effectiveResultState === "empty" ? <EmptyState /> : null}
            {effectiveResultState === "error" ? <ErrorState message={generationStatus?.error_message} /> : null}
            {effectiveResultState === "loading" ? <LoadingState activeStep={activeLoadingStep} activeStepIndex={activeStepIndex} /> : null}
            {effectiveResultState === "result" ? <ResultStateView cards={generatedCards} onDownload={(card) => downloadCard(card, showToast)} /> : null}
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

function downloadArchive(url: string | undefined, showToast: (message: string) => void) {
  if (!url) {
    showToast("Архив еще не готов");
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function downloadCard(card: ResultCard, showToast: (message: string) => void) {
  if (!card.previewUrl) {
    showToast("Файл карточки еще не готов");
    return;
  }

  window.open(card.previewUrl, "_blank", "noopener,noreferrer");
}

function getDefaultCardTypeIds(cardTypes: ReadonlyArray<{ id: CardTypeId; defaultSelected?: boolean }>) {
  const selected = cardTypes.filter((item) => item.defaultSelected).map((item) => item.id);

  if (selected.length) {
    return selected;
  }

  return cardTypes[0]?.id ? [cardTypes[0].id] : defaultSelectedCardTypes;
}
