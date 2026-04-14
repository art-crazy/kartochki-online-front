import type { GeneratedCard, GenerationStatusResponse } from "@/shared/api";
import { cardTypeOptions, loadingSteps, type CardTypeOption, type ResultCard } from "./content";

const resultCardPalette: ReadonlyArray<Omit<ResultCard, "id" | "label" | "previewUrl">> = [
  { accent: "#0f3460", background: "linear-gradient(160deg, #0f3460 0%, #e94560 100%)" },
  { accent: "#1a472a", background: "linear-gradient(160deg, #1a472a 0%, #52b788 100%)" },
  { accent: "#2d1b69", background: "linear-gradient(160deg, #2d1b69 0%, #f5a623 100%)" },
  { accent: "#2c3e50", background: "linear-gradient(160deg, #2c3e50 0%, #f39c12 100%)" },
];

export function mapGenerationCards(
  cards: ReadonlyArray<GeneratedCard> | undefined,
  availableCardTypes: ReadonlyArray<CardTypeOption>,
): ResultCard[] {
  if (!cards?.length) {
    return [];
  }

  const typeOptions = availableCardTypes.length ? availableCardTypes : cardTypeOptions;

  return cards.map((card, index) => {
    const type = typeOptions.find((item) => item.id === card.card_type_id);
    const palette = resultCardPalette[index % resultCardPalette.length];

    return {
      id: card.id,
      label: type?.label ?? card.card_type_id,
      accent: palette.accent,
      background: palette.background,
      previewUrl: card.preview_url,
    };
  });
}

export function getGenerationStepIndex(status: GenerationStatusResponse | undefined) {
  if (!status || status.status === "queued") {
    return 0;
  }

  const stepIndex = loadingSteps.findIndex((step) => step.id === status.current_step);
  if (stepIndex >= 0) {
    return stepIndex;
  }

  const progress = Math.min(100, Math.max(0, status.progress_percent ?? 0));
  return Math.min(loadingSteps.length - 1, Math.floor((progress / 100) * loadingSteps.length));
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}
