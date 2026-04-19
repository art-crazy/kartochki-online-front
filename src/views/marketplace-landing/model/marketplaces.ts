import { yandexMarket } from "./data/yandex-market";
import { ozon } from "./data/ozon";
import { wildberries } from "./data/wildberries";

export type MarketplaceTone = "wb" | "ozon" | "ym";

export type MarketplacePage = {
  slug: string;
  tone: MarketplaceTone;
  name: string;
  nameGenitive: string;
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  hero: {
    heading: string;
    subheading: string;
    badge: string;
    ctaLabel: string;
  };
  requirements: {
    title: string;
    items: string[];
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
};

const marketplacePagesList: MarketplacePage[] = [wildberries, ozon, yandexMarket];

const marketplacePages: Record<string, MarketplacePage> = Object.fromEntries(
  marketplacePagesList.map((page) => [page.slug, page]),
);

export function getMarketplacePage(slug: string): MarketplacePage | undefined {
  return marketplacePages[slug];
}

export function getAllMarketplacePages(): MarketplacePage[] {
  return marketplacePagesList;
}

export function getAllMarketplaceSlugs(): string[] {
  return marketplacePagesList.map((page) => page.slug);
}
