"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Button, Chip, Input } from "@/shared/ui";
import type {
  CardTypeId,
  CardTypeOption,
  MarketplaceId,
  MarketplaceOption,
  ModelId,
  ModelOption,
  ResultState,
  StyleId,
  StyleOption,
} from "../model/content";
import type { ProductContextDraft, ProductContextFormErrors } from "../model/productContext";
import { GenerateModelSelector } from "./GenerateModelSelector";
import { ProductContextSection } from "./ProductContextSection";
import styles from "./GenerateWorkspace.module.scss";

type GenerateControlsProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  marketplaces: ReadonlyArray<MarketplaceOption>;
  styles: ReadonlyArray<StyleOption>;
  cardTypes: ReadonlyArray<CardTypeOption>;
  cardCounts: ReadonlyArray<number>;
  models: ReadonlyArray<ModelOption>;
  marketplace: MarketplaceId;
  style: StyleId;
  modelId: ModelId;
  selectedTypes: ReadonlyArray<CardTypeId>;
  cardCount: number;
  projectName: string;
  productDraft: ProductContextDraft;
  productErrors: ProductContextFormErrors;
  canAddBenefit: boolean;
  canAddCharacteristic: boolean;
  uploadedFileName: string;
  uploadedFileUrl: string;
  isDraggingFile: boolean;
  canGenerate: boolean;
  resultState: ResultState;
  onMarketplaceChange: (value: MarketplaceId) => void;
  onStyleChange: (value: StyleId) => void;
  onModelChange: (value: ModelId) => void;
  onToggleCardType: (value: CardTypeId) => void;
  onCardCountChange: (value: number) => void;
  onProjectNameChange: (value: string) => void;
  onProductFieldChange: (field: "name" | "category" | "brand" | "description", value: string) => void;
  onProductBenefitChange: (index: number, value: string) => void;
  onAddProductBenefit: () => void;
  onRemoveProductBenefit: (index: number) => void;
  onProductCharacteristicChange: (index: number, field: "name" | "value", value: string) => void;
  onAddProductCharacteristic: () => void;
  onRemoveProductCharacteristic: (index: number) => void;
  onDraggingFileChange: (value: boolean) => void;
  onFileSelection: (file: File | null) => void;
  onGenerate: () => void;
};

export function GenerateControls({
  fileInputRef,
  marketplaces,
  styles: styleOptions,
  cardTypes,
  cardCounts,
  models,
  marketplace,
  style,
  modelId,
  selectedTypes,
  cardCount,
  projectName,
  productDraft,
  productErrors,
  canAddBenefit,
  canAddCharacteristic,
  uploadedFileName,
  uploadedFileUrl,
  isDraggingFile,
  canGenerate,
  resultState,
  onMarketplaceChange,
  onStyleChange,
  onModelChange,
  onToggleCardType,
  onCardCountChange,
  onProjectNameChange,
  onProductFieldChange,
  onProductBenefitChange,
  onAddProductBenefit,
  onRemoveProductBenefit,
  onProductCharacteristicChange,
  onAddProductCharacteristic,
  onRemoveProductCharacteristic,
  onDraggingFileChange,
  onFileSelection,
  onGenerate,
}: GenerateControlsProps) {
  const [cardCountInput, setCardCountInput] = useState(String(cardCount));
  const countInputRef = useRef<HTMLInputElement>(null);
  const sliderMax = 20;

  useEffect(() => {
    setCardCountInput(String(cardCount));
  }, [cardCount]);

  function applyCardCountInput(nextValue: string) {
    const digitsOnly = nextValue.replace(/\D+/g, "");
    setCardCountInput(digitsOnly);
    if (digitsOnly) onCardCountChange(Math.max(1, Number(digitsOnly)));
  }

  function commitCardCountInput() {
    const normalizedValue = cardCountInput ? Math.max(1, Number(cardCountInput)) : cardCount;
    setCardCountInput(String(normalizedValue));
    onCardCountChange(normalizedValue);
  }

  return (
    <form className={styles.leftPanel} onSubmit={(event) => event.preventDefault()}>
      <section className={styles.section}>
        <h2 className={styles.label}>Фото товара</h2>
        <button
          type="button"
          className={[styles.uploadZone, isDraggingFile ? styles.uploadZoneDragging : "", uploadedFileUrl ? styles.uploadZoneReady : ""].join(" ")}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            onDraggingFileChange(true);
          }}
          onDragLeave={() => onDraggingFileChange(false)}
          onDrop={(event) => {
            event.preventDefault();
            onDraggingFileChange(false);
            onFileSelection(event.dataTransfer.files[0] ?? null);
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
        <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={(event) => onFileSelection(event.target.files?.[0] ?? null)} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>Площадка</h2>
        <div className={styles.marketplaceGrid}>
          {marketplaces.map((option) => (
            <button
              key={option.id}
              type="button"
              className={[styles.marketplaceButton, marketplace === option.id ? styles.marketplaceButtonActive : ""].join(" ")}
              onClick={() => onMarketplaceChange(option.id)}
            >
              <span className={styles.marketplaceDot} style={{ color: option.dot }}>●</span>
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>Стиль</h2>
        <div className={[styles.chips, styles.styleChips].join(" ")}>
          {styleOptions.map((option) => (
            <Chip key={option.id} dark selected={style === option.id} onClick={() => onStyleChange(option.id)}>
              {option.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <GenerateModelSelector
          models={models}
          modelId={modelId}
          cardCount={cardCount}
          onModelChange={onModelChange}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>Типы карточек</h2>
        <div className={[styles.chips, styles.cardTypeChips].join(" ")}>
          {cardTypes.map((option) => (
            <Chip key={option.id} dark selected={selectedTypes.includes(option.id)} onClick={() => onToggleCardType(option.id)}>
              {option.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>Количество карточек</h2>
        <div className={styles.countPresets} role="group" aria-label="Быстрый выбор количества">
          {cardCounts.map((option) => (
            <button
              key={option}
              type="button"
              className={[styles.countChip, cardCount === option ? styles.countChipActive : ""].join(" ")}
              onClick={() => onCardCountChange(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className={styles.countBox}>
          <div className={styles.countBoxMain}>
            <div className={styles.countInputWrap}>
              <input
                ref={countInputRef}
                type="number"
                min={1}
                aria-label="Количество карточек"
                className={styles.countNumberInput}
                value={cardCountInput}
                onChange={(event) => applyCardCountInput(event.target.value)}
                onBlur={commitCardCountInput}
                onKeyDown={(event) => {
                  if (event.key === "Enter") (event.target as HTMLInputElement).blur();
                }}
              />
              <span className={styles.countUnitLabel}>{pluralCards(cardCount)}</span>
            </div>
            <div className={styles.countSteppers} aria-label="Изменить количество">
              <button type="button" className={styles.countStepper} aria-label="Уменьшить" onClick={() => onCardCountChange(Math.max(1, cardCount - 1))}>−</button>
              <button type="button" className={styles.countStepper} aria-label="Увеличить" onClick={() => onCardCountChange(cardCount + 1)}>+</button>
            </div>
          </div>
          <div className={styles.countRangeRow}>
            <span>1</span>
            <input
              type="range"
              min={1}
              max={sliderMax}
              value={Math.min(cardCount, sliderMax)}
              aria-label="Количество карточек"
              className={styles.countSlider}
              onChange={(event) => onCardCountChange(Number(event.target.value))}
            />
            <span>{sliderMax}+</span>
          </div>
        </div>
      </section>

      <Input
        dark
        label="Название проекта"
        controlClassName={styles.projectNameInput}
        placeholder="Например: Кроссовки Nike"
        value={projectName}
        onChange={(event) => onProjectNameChange(event.target.value)}
      />

      <ProductContextSection
        draft={productDraft}
        errors={productErrors}
        canAddBenefit={canAddBenefit}
        canAddCharacteristic={canAddCharacteristic}
        onFieldChange={onProductFieldChange}
        onBenefitChange={onProductBenefitChange}
        onAddBenefit={onAddProductBenefit}
        onRemoveBenefit={onRemoveProductBenefit}
        onCharacteristicChange={onProductCharacteristicChange}
        onAddCharacteristic={onAddProductCharacteristic}
        onRemoveCharacteristic={onRemoveProductCharacteristic}
      />

      <Button variant="darkPrimary" size="lg" block className={styles.generateButton} disabled={!canGenerate} onClick={onGenerate}>
        {resultState === "result" ? "⚡ Сгенерировать ещё" : "⚡ Сгенерировать карточки"}
      </Button>
    </form>
  );
}

function pluralCards(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "карточка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "карточки";
  return "карточек";
}

function shortenName(fileName: string) {
  return fileName.length > 20 ? `${fileName.slice(0, 18)}...` : fileName;
}
