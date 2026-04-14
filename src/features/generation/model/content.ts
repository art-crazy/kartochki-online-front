export type MarketplaceId = string;
export type StyleId = string;
export type CardTypeId = string;
export type ResultState = "empty" | "loading" | "result" | "error";

export type MarketplaceOption = {
  id: MarketplaceId;
  label: string;
  dot: string;
};

export type StyleOption = {
  id: StyleId;
  label: string;
};

export type CardTypeOption = {
  id: CardTypeId;
  label: string;
  defaultSelected?: boolean;
};

export type LoadingStep = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export type GenerateConfigContent = {
  marketplaces: ReadonlyArray<MarketplaceOption>;
  styles: ReadonlyArray<StyleOption>;
  cardTypes: ReadonlyArray<CardTypeOption>;
  cardCountOptions: ReadonlyArray<number>;
};

export type ResultCard = {
  id: string;
  label: string;
  accent: string;
  background: string;
  previewUrl?: string;
};

export const marketplaceOptions: ReadonlyArray<MarketplaceOption> = [
  { id: "wildberries", label: "Wildberries", dot: "#b886f5" },
  { id: "ozon", label: "Ozon", dot: "#5ba3f5" },
  { id: "yandex-market", label: "Яндекс Маркет", dot: "#f5a623" },
];

export const styleOptions: ReadonlyArray<StyleOption> = [
  { id: "minimal", label: "Минимализм" },
  { id: "bright", label: "Яркий" },
  { id: "dark", label: "Тёмный" },
  { id: "light", label: "Белый фон" },
];

export const cardTypeOptions: ReadonlyArray<CardTypeOption> = [
  { id: "main", label: "Главная", defaultSelected: true },
  { id: "infographic", label: "Инфографика", defaultSelected: true },
  { id: "composition", label: "Состав", defaultSelected: true },
  { id: "sizes", label: "Размеры", defaultSelected: true },
  { id: "advantages", label: "Преимущества" },
  { id: "details", label: "Детали" },
];

export const defaultSelectedCardTypes = cardTypeOptions
  .filter((item) => item.defaultSelected)
  .map((item) => item.id);

export const cardCountOptions: ReadonlyArray<number> = [3, 6, 8];

export const fallbackGenerateConfigContent: GenerateConfigContent = {
  marketplaces: marketplaceOptions,
  styles: styleOptions,
  cardTypes: cardTypeOptions,
  cardCountOptions,
};

export const loadingSteps: ReadonlyArray<LoadingStep> = [
  {
    id: "background",
    label: "Удаление фона",
    title: "Удаляем фон...",
    description: "AI аккуратно выделяет товар на фото",
  },
  {
    id: "cards",
    label: "Генерация карточек",
    title: "Генерируем карточки...",
    description: "Собираем комплект с нужным количеством слайдов",
  },
  {
    id: "style",
    label: "Применение стиля",
    title: "Применяем стиль...",
    description: "Подгоняем композицию под маркетплейс и визуальный тон",
  },
  {
    id: "final",
    label: "Финальная сборка",
    title: "Финальная сборка...",
    description: "Проверяем сет и готовим его к скачиванию",
  },
];

const resultCardPalette: ReadonlyArray<Omit<ResultCard, "id" | "label">> = [
  { accent: "#0f3460", background: "linear-gradient(160deg, #0f3460 0%, #e94560 100%)" },
  { accent: "#1a472a", background: "linear-gradient(160deg, #1a472a 0%, #52b788 100%)" },
  { accent: "#2d1b69", background: "linear-gradient(160deg, #2d1b69 0%, #f5a623 100%)" },
  { accent: "#2c3e50", background: "linear-gradient(160deg, #2c3e50 0%, #f39c12 100%)" },
  { accent: "#6a0572", background: "linear-gradient(160deg, #6a0572 0%, #e040fb 100%)" },
  { accent: "#1b4332", background: "linear-gradient(160deg, #1b4332 0%, #95d5b2 100%)" },
  { accent: "#892cdc", background: "linear-gradient(160deg, #4a0d67 0%, #ff7a18 100%)" },
  { accent: "#005f73", background: "linear-gradient(160deg, #005f73 0%, #ee9b00 100%)" },
];

export function buildResultCards(
  selectedTypes: ReadonlyArray<CardTypeId>,
  count: number,
  availableCardTypes: ReadonlyArray<CardTypeOption> = cardTypeOptions,
): ResultCard[] {
  const fallbackType = availableCardTypes[0] ?? cardTypeOptions[0];
  const chosenTypes = selectedTypes.length > 0 ? selectedTypes : [fallbackType.id];

  return Array.from({ length: count }, (_, index) => {
    const type = availableCardTypes.find((item) => item.id === chosenTypes[index % chosenTypes.length]) ?? fallbackType;
    const palette = resultCardPalette[index % resultCardPalette.length];

    return {
      id: `${type.id}-${index}`,
      label: type.label,
      accent: palette.accent,
      background: palette.background,
    };
  });
}
