import { getMarketplacePage, getAllMarketplacePages, type MarketplaceTone } from "@/views/marketplace-landing/model/marketplaces";
import { getToolPage, getAllToolPages } from "@/views/tool-landing/model/tools";

type MarketplaceToolFaq = {
  question: string;
  answer: string;
};

type MarketplaceToolStep = {
  step: string;
  title: string;
  description: string;
};

type MarketplaceToolFeature = {
  icon: string;
  title: string;
  description: string;
};

export type MarketplaceToolLanding = {
  marketplaceSlug: string;
  toolSlug: string;
  tone: MarketplaceTone;
  marketplaceName: string;
  toolName: string;
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  hero: {
    badge: string;
    heading: string;
    subheading: string;
    ctaLabel: string;
  };
  requirements: {
    title: string;
    items: string[];
  };
  steps: MarketplaceToolStep[];
  features: MarketplaceToolFeature[];
  faq: MarketplaceToolFaq[];
};

const TOOL_LABELS: Record<string, string> = {
  "generator-kartochek": "генератор карточек",
  infografika: "инфографика",
};

const TOOL_LABELS_CAPITALIZED: Record<string, string> = {
  "generator-kartochek": "Генератор карточек",
  infografika: "Инфографика",
};

export function buildMarketplaceToolHref(marketplaceSlug: string, toolSlug: string) {
  return `/marketplaces/${marketplaceSlug}/tools/${toolSlug}`;
}

export function getAllMarketplaceToolParams() {
  return getAllMarketplacePages().flatMap((marketplace) =>
    getAllToolPages().map((tool) => ({
      marketplaceSlug: marketplace.slug,
      toolSlug: tool.slug,
    })),
  );
}

export function getMarketplaceToolLanding(
  marketplaceSlug: string,
  toolSlug: string,
): MarketplaceToolLanding | null {
  const marketplace = getMarketplacePage(marketplaceSlug);
  const tool = getToolPage(toolSlug);

  if (!marketplace || !tool) {
    return null;
  }

  const toolLabel = TOOL_LABELS[toolSlug] ?? tool.hero.heading;
  const toolLabelCapitalized = TOOL_LABELS_CAPITALIZED[toolSlug] ?? tool.hero.heading;
  const pathDescription = `${toolLabelCapitalized} для ${marketplace.name}: ${tool.description}`;

  return {
    marketplaceSlug,
    toolSlug,
    tone: marketplace.tone,
    marketplaceName: marketplace.name,
    toolName: toolLabelCapitalized,
    title: `${toolLabelCapitalized} для ${marketplace.name} | kartochki.online`,
    description: pathDescription,
    keywords: [
      `${toolLabel} ${marketplace.name}`,
      `${toolLabelCapitalized} для ${marketplace.name}`,
      ...marketplace.keywords.slice(0, 3),
      ...tool.keywords.slice(0, 3),
    ],
    openGraphTitle: `${toolLabelCapitalized} для ${marketplace.name}`,
    openGraphDescription: `Используйте инструмент под требования ${marketplace.name}: размеры, фон, сценарии оформления и готовые материалы.`,
    hero: {
      badge: `${marketplace.name} × ${toolLabelCapitalized}`,
      heading: `${toolLabelCapitalized} для ${marketplace.name}`,
      subheading: `Страница применения инструмента под требования ${marketplace.name}. Сервис учитывает формат площадки, помогает собрать корректный визуал и ускоряет подготовку карточек без ручной рутины.`,
      ctaLabel: marketplace.hero.ctaLabel,
    },
    requirements: {
      title: `Что важно учесть для ${marketplace.name}`,
      items: marketplace.requirements.items.slice(0, 5),
    },
    steps: tool.howItWorks.map((item) => ({
      step: item.step,
      title: item.title,
      description: `${item.description} Для ${marketplace.name} сервис дополнительно учитывает требования площадки и сценарии публикации.`,
    })),
    features: buildFeatures(marketplace.name, toolLabelCapitalized, marketplace.features, tool.features),
    faq: buildFaq(marketplace.name, toolLabelCapitalized, marketplace.faq, tool.faq),
  };
}

function buildFeatures(
  marketplaceName: string,
  toolLabel: string,
  marketplaceFeatures: MarketplaceToolFeature[],
  toolFeatures: MarketplaceToolFeature[],
) {
  const selectedFeatures = [...toolFeatures.slice(0, 2), ...marketplaceFeatures.slice(0, 2)];

  return selectedFeatures.map((feature, index) => ({
    icon: feature.icon,
    title: feature.title,
    description:
      index < 2
        ? `${feature.description} Сценарий адаптирован под ${marketplaceName}.`
        : `${feature.description} Это особенно полезно, когда используется ${toolLabel.toLowerCase()}.`,
  }));
}

function buildFaq(
  marketplaceName: string,
  toolLabel: string,
  marketplaceFaq: MarketplaceToolFaq[],
  toolFaq: MarketplaceToolFaq[],
) {
  return [
    {
      question: `Подходит ли ${toolLabel.toLowerCase()} для ${marketplaceName}?`,
      answer: `Да. Страница сценария собрана именно под ${marketplaceName}: сервис учитывает требования площадки, а интерфейс ведёт к нужному формату материалов.`,
    },
    {
      question: `Что именно учитывается для ${marketplaceName}?`,
      answer: marketplaceFaq[0]?.answer ?? `Размеры, ограничения по оформлению и сценарии публикации на ${marketplaceName}.`,
    },
    {
      question: `Нужно ли отдельно настраивать ${toolLabel.toLowerCase()} под площадку?`,
      answer: toolFaq[0]?.answer ?? `Нет, базовые настройки уже собраны внутри сценария и подходят для работы с ${marketplaceName}.`,
    },
  ];
}
