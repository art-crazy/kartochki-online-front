import { allBlogPosts } from "@/entities/blog/model/content";
import { getAllMarketplacePages } from "@/views/marketplace-landing/model/marketplaces";
import {
  buildMarketplaceTemplateHref,
  getAllMarketplaceTemplateParams,
  getMarketplaceTemplateLanding,
} from "@/views/marketplace-template-landing/model/solutions";
import {
  buildMarketplaceToolHref,
  getAllMarketplaceToolParams,
  getMarketplaceToolLanding,
} from "@/views/marketplace-tool-landing/model/solutions";
import { getAllTemplatePages } from "@/views/template-landing/model/templates";
import { getAllToolPages } from "@/views/tool-landing/model/tools";

export type SiteMapLink = {
  href: string;
  label: string;
  description: string;
};

export type SiteMapSection = {
  title: string;
  summary: string;
  links: readonly SiteMapLink[];
};

const coreLinks: readonly SiteMapLink[] = [
  {
    href: "/",
    label: "Главная",
    description: "Главный вход в коммерческие и информационные разделы сервиса.",
  },
  {
    href: "/marketplaces",
    label: "Маркетплейсы",
    description: "Хаб посадочных страниц по Wildberries, Ozon и Яндекс Маркету.",
  },
  {
    href: "/tools",
    label: "Инструменты",
    description: "Каталог продуктовых сценариев: генератор карточек и инфографика.",
  },
  {
    href: "/templates",
    label: "Шаблоны",
    description: "Подборки шаблонов карточек по товарным категориям.",
  },
  {
    href: "/blog",
    label: "Блог",
    description: "Информационный кластер со статьями для продавцов маркетплейсов.",
  },
] as const;

export function getSiteMapSections(): SiteMapSection[] {
  return [
    {
      title: "Основные разделы",
      summary: "Ключевые hub-страницы, от которых строится вся навигация сайта.",
      links: coreLinks,
    },
    {
      title: "Страницы маркетплейсов",
      summary: "Коммерческие посадочные под требования конкретных площадок.",
      links: getAllMarketplacePages().map((page) => ({
        href: `/marketplaces/${page.slug}`,
        label: page.name,
        description: page.description,
      })),
    },
    {
      title: "Инструменты",
      summary: "Страницы с отдельными сценариями использования сервиса.",
      links: getAllToolPages().map((page) => ({
        href: `/tools/${page.slug}`,
        label: page.hero.heading,
        description: page.description,
      })),
    },
    {
      title: "Сценарии по площадкам",
      summary: "Глубокие коммерческие страницы пересечения инструмента и маркетплейса.",
      links: getAllMarketplaceToolParams()
        .map(({ marketplaceSlug, toolSlug }) => {
          const page = getMarketplaceToolLanding(marketplaceSlug, toolSlug);
          if (!page) {
            return null;
          }

          return {
            href: buildMarketplaceToolHref(marketplaceSlug, toolSlug),
            label: `${page.toolName} для ${page.marketplaceName}`,
            description: page.description,
          };
        })
        .filter((link): link is SiteMapLink => link !== null),
    },
    {
      title: "Шаблоны по площадкам",
      summary: "Глубокие категорийные страницы пересечения маркетплейса и товарного шаблона.",
      links: getAllMarketplaceTemplateParams()
        .map(({ marketplaceSlug, templateSlug }) => {
          const page = getMarketplaceTemplateLanding(marketplaceSlug, templateSlug);
          if (!page) {
            return null;
          }

          return {
            href: buildMarketplaceTemplateHref(marketplaceSlug, templateSlug),
            label: `${page.templateName} для ${page.marketplaceName}`,
            description: page.description,
          };
        })
        .filter((link): link is SiteMapLink => link !== null),
    },
    {
      title: "Шаблоны карточек",
      summary: "Категорийные посадочные для шаблонов и заготовок карточек.",
      links: getAllTemplatePages().map((page) => ({
        href: `/templates/${page.slug}`,
        label: page.categoryName,
        description: page.description,
      })),
    },
    {
      title: "Статьи блога",
      summary: "Информационные материалы, которые связывают спрос и коммерческие страницы.",
      links: allBlogPosts.map((post) => ({
        href: post.canonicalPath,
        label: post.title,
        description: post.description,
      })),
    },
  ];
}

export function getIndexableSiteMapLinks(): SiteMapLink[] {
  return getSiteMapSections().flatMap((section) => section.links);
}
