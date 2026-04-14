"use client";

import Image from "next/image";
import type { RefObject } from "react";
import { Button, Chip, Input } from "@/shared/ui";
import type {
  CardTypeId,
  CardTypeOption,
  MarketplaceId,
  MarketplaceOption,
  ResultState,
  StyleId,
  StyleOption,
} from "../model/content";
import styles from "./GenerateWorkspace.module.scss";

type GenerateControlsProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  marketplaces: ReadonlyArray<MarketplaceOption>;
  styles: ReadonlyArray<StyleOption>;
  cardTypes: ReadonlyArray<CardTypeOption>;
  cardCounts: ReadonlyArray<number>;
  marketplace: MarketplaceId;
  style: StyleId;
  selectedTypes: ReadonlyArray<CardTypeId>;
  cardCount: number;
  projectName: string;
  uploadedFileName: string;
  uploadedFileUrl: string;
  isDraggingFile: boolean;
  canGenerate: boolean;
  resultState: ResultState;
  onMarketplaceChange: (value: MarketplaceId) => void;
  onStyleChange: (value: StyleId) => void;
  onToggleCardType: (value: CardTypeId) => void;
  onCardCountChange: (value: number) => void;
  onProjectNameChange: (value: string) => void;
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
  marketplace,
  style,
  selectedTypes,
  cardCount,
  projectName,
  uploadedFileName,
  uploadedFileUrl,
  isDraggingFile,
  canGenerate,
  resultState,
  onMarketplaceChange,
  onStyleChange,
  onToggleCardType,
  onCardCountChange,
  onProjectNameChange,
  onDraggingFileChange,
  onFileSelection,
  onGenerate,
}: GenerateControlsProps) {
  return (
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
        <div className={styles.countSelector}>
          {cardCounts.map((option) => (
            <button
              key={option}
              type="button"
              className={[styles.countButton, cardCount === option ? styles.countButtonActive : ""].join(" ")}
              onClick={() => onCardCountChange(option)}
            >
              {option}
            </button>
          ))}
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

      <Button variant="darkPrimary" size="lg" block className={styles.generateButton} disabled={!canGenerate} onClick={onGenerate}>
        {resultState === "result" ? "⚡ Сгенерировать ещё" : "⚡ Сгенерировать карточки"}
      </Button>
    </form>
  );
}

function shortenName(fileName: string) {
  return fileName.length > 20 ? `${fileName.slice(0, 18)}...` : fileName;
}
