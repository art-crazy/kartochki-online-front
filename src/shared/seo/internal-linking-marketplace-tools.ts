import { getAllMarketplacePages } from "@/views/marketplace-landing/model/marketplaces";
import { getAllToolPages } from "@/views/tool-landing/model/tools";
import { buildMarketplaceToolHref } from "@/views/marketplace-tool-landing/model/solutions";
import type { SeoLinkGroup, SeoLinkItem } from "./internal-linking";

export function getMarketplaceToolLinksForMarketplace(marketplaceSlug: string): SeoLinkItem[] {
  const marketplace = getAllMarketplacePages().find((page) => page.slug === marketplaceSlug);
  if (!marketplace) {
    return [];
  }

  return getAllToolPages().map((tool) => ({
    href: buildMarketplaceToolHref(marketplaceSlug, tool.slug),
    label: `${shortToolLabel(tool.slug)} для ${marketplace.name}`,
    description: `Сценарий применения инструмента под требования ${marketplace.name}.`,
  }));
}

export function getMarketplaceToolLinksForTool(toolSlug: string): SeoLinkItem[] {
  const tool = getAllToolPages().find((page) => page.slug === toolSlug);
  if (!tool) {
    return [];
  }

  return getAllMarketplacePages().map((marketplace) => ({
    href: buildMarketplaceToolHref(marketplace.slug, toolSlug),
    label: `${shortToolLabel(toolSlug)} для ${marketplace.name}`,
    description: `Отдельная коммерческая страница применения инструмента под ${marketplace.name}.`,
  }));
}

export function getMarketplaceToolPageLinkGroups(marketplaceSlug: string, toolSlug: string): SeoLinkGroup[] {
  const marketplace = getAllMarketplacePages().find((page) => page.slug === marketplaceSlug);
  const tool = getAllToolPages().find((page) => page.slug === toolSlug);

  if (!marketplace || !tool) {
    return [];
  }

  return [
    {
      title: `Другие сценарии для ${marketplace.name}`,
      links: getMarketplaceToolLinksForMarketplace(marketplaceSlug).filter(
        (link) => link.href !== buildMarketplaceToolHref(marketplaceSlug, toolSlug),
      ),
    },
    {
      title: `Где ещё использовать ${shortToolLabel(toolSlug).toLowerCase()}`,
      links: getMarketplaceToolLinksForTool(toolSlug).filter(
        (link) => link.href !== buildMarketplaceToolHref(marketplaceSlug, toolSlug),
      ),
    },
    {
      title: "Вернуться в основные хабы",
      links: [
        {
          href: `/marketplaces/${marketplaceSlug}`,
          label: marketplace.name,
          description: `Главная страница направления по ${marketplace.name}.`,
        },
        {
          href: `/tools/${toolSlug}`,
          label: shortToolLabel(toolSlug),
          description: "Основная страница инструмента без привязки к одной площадке.",
        },
      ],
    },
  ].filter((group) => group.links.length > 0);
}

function shortToolLabel(toolSlug: string) {
  return toolSlug === "generator-kartochek" ? "Генератор карточек" : "Инфографика";
}
