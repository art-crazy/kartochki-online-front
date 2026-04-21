import type { ModelId, ModelOption } from "../model/content";
import styles from "./GenerateWorkspace.module.scss";

const priceFormatter = new Intl.NumberFormat("ru-RU");

type GenerateModelSelectorProps = {
  models: ReadonlyArray<ModelOption>;
  modelId: ModelId;
  cardCount: number;
  onModelChange: (value: ModelId) => void;
};

export function GenerateModelSelector({ models, modelId, cardCount, onModelChange }: GenerateModelSelectorProps) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.label}>AI-модель</h2>
        <span className={styles.sectionMeta}>{formatPrice(getSelectedModelPrice(models, modelId) * cardCount)} за {cardCount} шт.</span>
      </div>
      <div className={styles.modelList}>
        {models.map((option) => {
          const isSelected = modelId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={[styles.modelCard, isSelected ? styles.modelCardActive : ""].join(" ")}
              onClick={() => onModelChange(option.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.modelCardHead}>
                <span className={styles.modelName}>{option.label}</span>
                <span className={styles.modelPrice}>{formatPrice(option.pricePerImage)}/шт.</span>
              </div>
              <p className={styles.modelDescription}>{option.description}</p>
              <div className={styles.modelTotal}>Итого: {formatPrice(option.pricePerImage * cardCount)}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function getSelectedModelPrice(models: ReadonlyArray<ModelOption>, modelId: ModelId) {
  return models.find((item) => item.id === modelId)?.pricePerImage ?? models[0]?.pricePerImage ?? 0;
}

function formatPrice(value: number) {
  return `${priceFormatter.format(value)} ₽`;
}
