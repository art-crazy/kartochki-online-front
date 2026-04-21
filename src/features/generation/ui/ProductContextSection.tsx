"use client";

import { Button, Input, Textarea } from "@/shared/ui";
import {
  PRODUCT_BENEFIT_MAX_LENGTH,
  PRODUCT_BRAND_MAX_LENGTH,
  PRODUCT_CATEGORY_MAX_LENGTH,
  PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  type ProductContextDraft,
  type ProductContextFormErrors,
} from "../model/productContext";
import styles from "./ProductContextSection.module.scss";

type ProductContextSectionProps = {
  draft: ProductContextDraft;
  errors: ProductContextFormErrors;
  canAddBenefit: boolean;
  canAddCharacteristic: boolean;
  onFieldChange: (field: "name" | "category" | "brand" | "description", value: string) => void;
  onBenefitChange: (index: number, value: string) => void;
  onAddBenefit: () => void;
  onRemoveBenefit: (index: number) => void;
  onCharacteristicChange: (index: number, field: "name" | "value", value: string) => void;
  onAddCharacteristic: () => void;
  onRemoveCharacteristic: (index: number) => void;
};

export function ProductContextSection({
  draft,
  errors,
  canAddBenefit,
  canAddCharacteristic,
  onFieldChange,
  onBenefitChange,
  onAddBenefit,
  onRemoveBenefit,
  onCharacteristicChange,
  onAddCharacteristic,
  onRemoveCharacteristic,
}: ProductContextSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.groupTitle}>Информация о товаре</h2>
      <p className={styles.hint}>Эти данные помогут сгенерировать карточки с текстом, преимуществами и инфографикой.</p>
      {errors.form ? <div className={styles.errorBanner}>{errors.form}</div> : null}

      <Input
        dark
        label="Название товара"
        hint="Название товара будет использоваться в тексте карточек"
        error={errors.name}
        controlClassName={styles.field}
        maxLength={PRODUCT_NAME_MAX_LENGTH}
        placeholder="Например: Женские кроссовки Nike Air Zoom"
        value={draft.name}
        onChange={(event) => onFieldChange("name", event.target.value)}
      />

      <Input
        dark
        label="Категория"
        error={errors.category}
        controlClassName={styles.field}
        maxLength={PRODUCT_CATEGORY_MAX_LENGTH}
        placeholder="Например: обувь"
        value={draft.category}
        onChange={(event) => onFieldChange("category", event.target.value)}
      />

      <Input
        dark
        label="Бренд"
        error={errors.brand}
        controlClassName={styles.field}
        maxLength={PRODUCT_BRAND_MAX_LENGTH}
        placeholder="Например: Nike"
        value={draft.brand}
        onChange={(event) => onFieldChange("brand", event.target.value)}
      />

      <Textarea
        dark
        label="Описание"
        hint="Описание поможет сгенерировать более точный сценарий и подачу"
        error={errors.description}
        controlClassName={`${styles.field} ${styles.textarea}`}
        maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
        placeholder="Кратко опишите товар, его назначение и ключевые особенности"
        value={draft.description}
        onChange={(event) => onFieldChange("description", event.target.value)}
      />

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div>
            <div className={styles.groupTitle}>Преимущества</div>
            <div className={styles.groupHint}>Преимущества помогут сгенерировать продающие акценты</div>
          </div>
          <Button variant="darkOutline" size="sm" disabled={!canAddBenefit} onClick={onAddBenefit}>
            Добавить
          </Button>
        </div>
        <div className={styles.rows}>
          {draft.benefits.map((benefit, index) => (
            <div key={`benefit-${index}`} className={styles.benefitRow}>
              <Input
                dark
                className={styles.benefitField}
                controlClassName={styles.field}
                error={errors.benefits[index]}
                maxLength={PRODUCT_BENEFIT_MAX_LENGTH}
                placeholder={`Преимущество ${index + 1}`}
                value={benefit}
                onChange={(event) => onBenefitChange(index, event.target.value)}
              />
              <Button variant="darkOutline" size="sm" className={styles.removeButton} onClick={() => onRemoveBenefit(index)}>
                Убрать
              </Button>
            </div>
          ))}
        </div>
        {errors.benefitsForm ? <div className={styles.groupError}>{errors.benefitsForm}</div> : null}
      </div>

      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <div>
            <div className={styles.groupTitle}>Характеристики</div>
            <div className={styles.groupHint}>Характеристики могут использоваться в инфографике и деталях товара</div>
          </div>
          <Button variant="darkOutline" size="sm" disabled={!canAddCharacteristic} onClick={onAddCharacteristic}>
            Добавить
          </Button>
        </div>
        <div className={styles.rows}>
          {draft.characteristics.map((item, index) => (
            <div key={`characteristic-${index}`} className={styles.characteristicRow}>
              <Input
                dark
                className={styles.characteristicField}
                controlClassName={styles.field}
                error={errors.characteristics[index]?.name}
                maxLength={PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH}
                placeholder="Название"
                value={item.name}
                onChange={(event) => onCharacteristicChange(index, "name", event.target.value)}
              />
              <Input
                dark
                className={styles.characteristicField}
                controlClassName={styles.field}
                error={errors.characteristics[index]?.value}
                maxLength={PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH}
                placeholder="Значение"
                value={item.value}
                onChange={(event) => onCharacteristicChange(index, "value", event.target.value)}
              />
              <Button variant="darkOutline" size="sm" className={styles.removeButton} onClick={() => onRemoveCharacteristic(index)}>
                Убрать
              </Button>
            </div>
          ))}
        </div>
        {errors.characteristicsForm ? <div className={styles.groupError}>{errors.characteristicsForm}</div> : null}
      </div>
    </section>
  );
}
