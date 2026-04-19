import { readMarkdownCollection } from "@/shared/content/marketing/markdown";

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

type MarketplacePageFrontmatter = Omit<MarketplacePage, "slug"> & {
  order?: number;
};

const marketplacePagesList: MarketplacePage[] = readMarkdownCollection<MarketplacePageFrontmatter>("marketplaces").map(
  ({ slug, data }) => ({
    slug,
    tone: data.tone,
    name: data.name,
    nameGenitive: data.nameGenitive,
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraphTitle: data.openGraphTitle,
    openGraphDescription: data.openGraphDescription,
    hero: data.hero,
    requirements: data.requirements,
    features: data.features,
    faq: data.faq,
  }),
);

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
