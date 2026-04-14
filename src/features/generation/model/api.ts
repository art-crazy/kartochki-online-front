import "server-only";

import {
  getGenerateConfig,
  type GenerateCardType,
  type GenerateConfigResponse,
  type GenerateMarketplace,
  type GenerateStyle,
} from "@/shared/api";
import { getSessionToken } from "@/shared/auth/server";
import {
  fallbackGenerateConfigContent,
  type CardTypeOption,
  type GenerateConfigContent,
  type MarketplaceOption,
  type StyleOption,
} from "./content";

const marketplaceDotMap: Record<string, string> = {
  wildberries: "#b886f5",
  wb: "#b886f5",
  ozon: "#5ba3f5",
  yandex_market: "#f5a623",
  ym: "#f5a623",
};

export async function loadGenerateConfigContent(): Promise<GenerateConfigContent> {
  const token = await getSessionToken();

  if (!token) {
    return fallbackGenerateConfigContent;
  }

  try {
    const result = await getGenerateConfig({
      auth: token,
      cache: "no-store",
    });

    if (result.error || !result.data) {
      return fallbackGenerateConfigContent;
    }

    return mapGenerateConfigResponse(result.data);
  } catch {
    return fallbackGenerateConfigContent;
  }
}

function mapGenerateConfigResponse(response: GenerateConfigResponse): GenerateConfigContent {
  return {
    marketplaces: mapWithFallback(response.marketplaces, mapMarketplace, fallbackGenerateConfigContent.marketplaces),
    styles: mapWithFallback(response.styles, mapStyle, fallbackGenerateConfigContent.styles),
    cardTypes: mapWithFallback(response.card_types, mapCardType, fallbackGenerateConfigContent.cardTypes),
    cardCountOptions: getCardCountOptions(response.card_count_options),
  };
}

function mapWithFallback<TSource, TTarget>(
  items: ReadonlyArray<TSource>,
  mapper: (item: TSource) => TTarget,
  fallback: ReadonlyArray<TTarget>,
): ReadonlyArray<TTarget> {
  return items.length ? items.map(mapper) : fallback;
}

function mapMarketplace(item: GenerateMarketplace): MarketplaceOption {
  return {
    id: item.id,
    label: item.label,
    dot: marketplaceDotMap[normalizeId(item.id)] ?? "#8ca0b3",
  };
}

function mapStyle(item: GenerateStyle): StyleOption {
  return {
    id: item.id,
    label: item.label,
  };
}

function mapCardType(item: GenerateCardType): CardTypeOption {
  return {
    id: item.id,
    label: item.label,
    defaultSelected: item.default_selected,
  };
}

function getCardCountOptions(values: ReadonlyArray<number>) {
  const options = values.filter((value) => Number.isInteger(value) && value > 0);

  return options.length ? options : fallbackGenerateConfigContent.cardCountOptions;
}

function normalizeId(value: string) {
  return value.trim().toLowerCase().replaceAll("-", "_");
}
