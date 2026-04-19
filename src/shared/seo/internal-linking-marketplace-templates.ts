import { getAllMarketplacePages } from "@/views/marketplace-landing/model/marketplaces";
import { buildMarketplaceTemplateHref } from "@/views/marketplace-template-landing/model/solutions";
import { getAllTemplatePages } from "@/views/template-landing/model/templates";
import type { SeoLinkGroup, SeoLinkItem } from "./internal-linking";

export function getMarketplaceTemplateLinksForMarketplace(marketplaceSlug: string): SeoLinkItem[] {
  const marketplace = getAllMarketplacePages().find((page) => page.slug === marketplaceSlug);
  if (!marketplace) {
    return [];
  }

  return getAllTemplatePages().map((template) => ({
    href: buildMarketplaceTemplateHref(marketplaceSlug, template.slug),
    label: `${template.categoryName} для ${marketplace.name}`,
    description: `Категорийная посадочная под ${marketplace.name} и шаблон ${template.categoryName}.`,
  }));
}

export function getMarketplaceTemplateLinksForTemplate(templateSlug: string): SeoLinkItem[] {
  const template = getAllTemplatePages().find((page) => page.slug === templateSlug);
  if (!template) {
    return [];
  }

  return getAllMarketplacePages().map((marketplace) => ({
    href: buildMarketplaceTemplateHref(marketplace.slug, templateSlug),
    label: `${template.categoryName} для ${marketplace.name}`,
    description: `Отдельная страница шаблона ${template.categoryName} под ${marketplace.name}.`,
  }));
}

export function getMarketplaceTemplatePageLinkGroups(
  marketplaceSlug: string,
  templateSlug: string,
): SeoLinkGroup[] {
  const marketplace = getAllMarketplacePages().find((page) => page.slug === marketplaceSlug);
  const template = getAllTemplatePages().find((page) => page.slug === templateSlug);

  if (!marketplace || !template) {
    return [];
  }

  return [
    {
      title: `Другие шаблоны для ${marketplace.name}`,
      links: getMarketplaceTemplateLinksForMarketplace(marketplaceSlug).filter(
        (link) => link.href !== buildMarketplaceTemplateHref(marketplaceSlug, templateSlug),
      ),
    },
    {
      title: `Где ещё использовать шаблон ${template.categoryName.toLowerCase()}`,
      links: getMarketplaceTemplateLinksForTemplate(templateSlug).filter(
        (link) => link.href !== buildMarketplaceTemplateHref(marketplaceSlug, templateSlug),
      ),
    },
    {
      title: "Вернуться в основные разделы",
      links: [
        {
          href: `/marketplaces/${marketplaceSlug}`,
          label: marketplace.name,
          description: `Основная страница направления по ${marketplace.name}.`,
        },
        {
          href: `/templates/${templateSlug}`,
          label: template.categoryName,
          description: "Основная страница шаблона без привязки к одной площадке.",
        },
      ],
    },
  ].filter((group) => group.links.length > 0);
}
