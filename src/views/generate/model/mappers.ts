import type { GenerateCardType, GenerateConfigResponse, GenerateMarketplace, GenerateStyle } from "@/shared/api";
import {
  type CardTypeOption,
  type GenerateConfigContent,
  type MarketplaceOption,
  type StyleOption,
} from "@/features/generation/model/content";

const marketplaceDotMap: Record<string, string> = {
  wildberries: "#b886f5",
  wb: "#b886f5",
  ozon: "#5ba3f5",
  yandex_market: "#f5a623",
  ym: "#f5a623",
};

export function mapGenerateConfigResponse(response: GenerateConfigResponse): GenerateConfigContent {
  const validCounts = response.card_count_options.filter((v) => Number.isInteger(v) && v > 0);
  if (!response.marketplaces.length || !response.styles.length || !response.card_types.length || !validCounts.length) {
    throw new Error("Generate config response is incomplete");
  }

  return {
    marketplaces: response.marketplaces.map(mapMarketplace),
    styles: response.styles.map(mapStyle),
    cardTypes: response.card_types.map(mapCardType),
    cardCountOptions: validCounts,
  };
}

function mapMarketplace(item: GenerateMarketplace): MarketplaceOption {
  const id = item.id.trim().toLowerCase().replaceAll("-", "_");
  return { id: item.id, label: item.label, dot: marketplaceDotMap[id] ?? "#8ca0b3" };
}

function mapStyle(item: GenerateStyle): StyleOption {
  return { id: item.id, label: item.label };
}

function mapCardType(item: GenerateCardType): CardTypeOption {
  return { id: item.id, label: item.label, defaultSelected: item.default_selected };
}
