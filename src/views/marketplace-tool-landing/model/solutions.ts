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
  const marketplaceGenitive = marketplace.nameGenitive;
  const pathDescription = `${toolLabelCapitalized} для ${marketplaceGenitive}: ${tool.description}`;

  return {
    marketplaceSlug,
    toolSlug,
    tone: marketplace.tone,
    marketplaceName: marketplace.name,
    toolName: toolLabelCapitalized,
    title: `${toolLabelCapitalized} для ${marketplaceGenitive} | kartochki.online`,
    description: pathDescription,
    keywords: [
      `${toolLabel} ${marketplace.name}`,
      `${toolLabelCapitalized} для ${marketplaceGenitive}`,
      ...marketplace.keywords.slice(0, 3),
      ...tool.keywords.slice(0, 3),
    ],
    openGraphTitle: `${toolLabelCapitalized} для ${marketplaceGenitive}`,
    openGraphDescription: `Используйте ${toolLabel} под требования ${marketplaceGenitive}: готовая логика оформления, правильные акценты и материалы, которые помогают быстрее публиковать товар.`,
    hero: {
      badge: `${marketplace.name} x ${toolLabelCapitalized}`,
      heading: `${toolLabelCapitalized} для ${marketplaceGenitive}`,
      subheading: buildToolHeroSubheading(marketplace.slug, marketplace.name, marketplaceGenitive, toolSlug),
      ctaLabel: marketplace.hero.ctaLabel,
    },
    requirements: {
      title: buildRequirementsTitle(toolSlug, marketplace.name),
      items: marketplace.requirements.items.slice(0, 5),
    },
    steps: tool.howItWorks.map((item) => ({
      step: item.step,
      title: item.title,
      description: `${item.description} ${buildToolStepSuffix(marketplace.slug, toolSlug, marketplace.name)}`,
    })),
    features: buildFeatures(marketplace.slug, marketplace.name, toolLabelCapitalized, marketplace.features, tool.features),
    faq: buildFaq(marketplace.name, marketplaceGenitive, toolLabelCapitalized, marketplace.faq, tool.faq),
  };
}

function buildFeatures(
  marketplaceSlug: string,
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
        ? `${feature.description} ${buildFeatureSuffix(marketplaceSlug, marketplaceName)}`
        : `${feature.description} Это особенно полезно, когда используется ${toolLabel.toLowerCase()} и нужно выпускать материалы без лишней ручной рутины.`,
  }));
}

function buildFaq(
  marketplaceName: string,
  marketplaceGenitive: string,
  toolLabel: string,
  marketplaceFaq: MarketplaceToolFaq[],
  toolFaq: MarketplaceToolFaq[],
) {
  return [
    {
      question: `Подходит ли ${toolLabel.toLowerCase()} для ${marketplaceGenitive}?`,
      answer: `Да. Сценарий собран именно под ${marketplaceGenitive}: сервис учитывает требования площадки и помогает быстро прийти к формату материалов, который уместен для публикации на ${marketplaceName}.`,
    },
    {
      question: `Что именно учитывается для ${marketplaceGenitive}?`,
      answer: marketplaceFaq[0]?.answer ?? `Учитываются ограничения по оформлению, логика подачи и сценарии публикации на ${marketplaceName}.`,
    },
    {
      question: `Нужно ли отдельно настраивать ${toolLabel.toLowerCase()} под площадку?`,
      answer: toolFaq[0]?.answer ?? `Нет. Базовые настройки уже собраны внутри сценария и подходят для работы с ${marketplaceName}.`,
    },
  ];
}

function buildToolHeroSubheading(
  marketplaceSlug: string,
  marketplaceName: string,
  marketplaceGenitive: string,
  toolSlug: string,
) {
  const marketplaceFocus: Record<string, string> = {
    wildberries: "заметности в выдаче, читаемости в мобильном превью и скорости обновления ассортимента",
    ozon: "аккуратной коммерческой подаче, понятной структуре карточки и доверии к товару",
    "yandex-market": "характеристиках, аргументах, совместимости и рациональном выборе покупателя",
  };

  const toolFocus: Record<string, string> = {
    "generator-kartochek": "собрать полноценную карточку: обложку, дополнительные слайды и структуру под категорию",
    infografika: "сделать слайды, которые быстро объясняют выгоды, характеристики и сценарий использования товара",
  };

  return `Инструмент помогает продавцам на ${marketplaceName} быстрее готовить контент без долгой ручной сборки. Сценарий заточен под требования ${marketplaceGenitive} и помогает ${toolFocus[toolSlug] ?? "готовить материалы под маркетплейс"} с упором на ${marketplaceFocus[marketplaceSlug] ?? "понятную коммерческую подачу"}.`;
}

function buildRequirementsTitle(toolSlug: string, marketplaceName: string) {
  return toolSlug === "generator-kartochek"
    ? `Что важно учесть при сборке карточки для ${marketplaceName}`
    : `Что важно учесть в инфографике для ${marketplaceName}`;
}

function buildToolStepSuffix(marketplaceSlug: string, toolSlug: string, marketplaceName: string) {
  const marketplaceSuffix: Record<string, string> = {
    wildberries: `Для ${marketplaceName} это особенно важно, если нужно зацепить покупателя в выдаче и быстро объяснить выгоды.`,
    ozon: `Для ${marketplaceName} это особенно важно, если нужен аккуратный и понятный коммерческий визуал без перегруза.`,
    "yandex-market": `Для ${marketplaceName} это особенно важно, если нужно подчеркнуть характеристики, комплект и аргументы выбора.`,
  };

  const toolSuffix =
    toolSlug === "generator-kartochek"
      ? "Это сокращает путь от идеи до публикации товара."
      : "Это помогает убрать из слайдов воду и оставить только то, что реально влияет на покупку.";

  return `${marketplaceSuffix[marketplaceSlug] ?? ""} ${toolSuffix}`.trim();
}

function buildFeatureSuffix(marketplaceSlug: string, marketplaceName: string) {
  const suffixes: Record<string, string> = {
    wildberries: `Сценарий адаптирован под ${marketplaceName} и работу в условиях высокой конкуренции в выдаче.`,
    ozon: `Сценарий адаптирован под ${marketplaceName} и делает карточку более аккуратной и понятной для покупателя.`,
    "yandex-market": `Сценарий адаптирован под ${marketplaceName} и помогает лучше раскрывать характеристики и аргументы выбора.`,
  };

  return suffixes[marketplaceSlug] ?? `Сценарий адаптирован под ${marketplaceName}.`;
}
