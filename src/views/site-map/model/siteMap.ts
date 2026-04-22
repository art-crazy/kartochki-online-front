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
    description: "Главная страница сервиса с основными сценариями для продавцов маркетплейсов.",
  },
  {
    href: "/marketplaces",
    label: "Маркетплейсы",
    description: "Подборка страниц по Wildberries, Ozon и Яндекс Маркету с отдельными сценариями оформления карточек.",
  },
  {
    href: "/tools",
    label: "Инструменты",
    description: "Продуктовые страницы сервиса: генератор карточек и инструмент для инфографики.",
  },
  {
    href: "/templates",
    label: "Шаблоны",
    description: "Категорийные шаблоны карточек товаров для разных ниш и типов ассортимента.",
  },
  {
    href: "/blog",
    label: "Блог",
    description: "Статьи для продавцов маркетплейсов: требования к фото, инфографика, ошибки карточек и практические советы.",
  },
] as const;

const legalLinks: readonly SiteMapLink[] = [
  {
    href: "/oferta",
    label: "Оферта",
    description: "Публичная оферта на доступ к SaaS-сервису kartochki.online и платной подписке с автопродлением.",
  },
  {
    href: "/privacy",
    label: "Политика конфиденциальности",
    description: "Правила обработки персональных данных, cookies, billing-событий и обращений пользователей.",
  },
  {
    href: "/consent",
    label: "Согласие на обработку ПДн",
    description: "Публичный текст согласия на обработку персональных данных для регистрации, оплаты и поддержки.",
  },
  {
    href: "/vozvrat",
    label: "Возвраты и отмена",
    description: "Порядок отключения автопродления, возвратов и действия подписки до конца оплаченного периода.",
  },
  {
    href: "/rekvizity",
    label: "Реквизиты",
    description: "Реквизиты оператора сервиса для договорных, платежных и юридических сценариев.",
  },
] as const;

export function getSiteMapSections(): SiteMapSection[] {
  return [
    {
      title: "Основные разделы",
      summary: "Быстрый вход в ключевые разделы сайта: инструменты, шаблоны, страницы по маркетплейсам и блог.",
      links: coreLinks,
    },
    {
      title: "Страницы маркетплейсов",
      summary: "Отдельные посадочные страницы по Wildberries, Ozon и Яндекс Маркету с упором на оформление карточек под площадку.",
      links: getAllMarketplacePages().map((page) => ({
        href: `/marketplaces/${page.slug}`,
        label: page.name,
        description: page.description,
      })),
    },
    {
      title: "Инструменты",
      summary: "Основные продуктовые сценарии сервиса: создание карточек товаров и инфографики для маркетплейсов.",
      links: getAllToolPages().map((page) => ({
        href: `/tools/${page.slug}`,
        label: page.hero.heading,
        description: page.description,
      })),
    },
    {
      title: "Инструменты по площадкам",
      summary: "Более точные страницы, где инструмент привязан к конкретному маркетплейсу и пользовательскому запросу.",
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
      summary: "Страницы пересечения маркетплейса и категории товара для тех, кто ищет более конкретный шаблон карточки.",
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
      summary: "Категорийные страницы с заготовками и ориентирами по оформлению карточек товаров.",
      links: getAllTemplatePages().map((page) => ({
        href: `/templates/${page.slug}`,
        label: page.categoryName,
        description: page.description,
      })),
    },
    {
      title: "Статьи блога",
      summary: "Полезные материалы для продавцов: требования маркетплейсов, советы по контенту и разбор типовых ошибок.",
      links: allBlogPosts.map((post) => ({
        href: post.canonicalPath,
        label: post.title,
        description: post.description,
      })),
    },
    {
      title: "Правовая информация",
      summary: "Публичные документы сервиса: оферта, персональные данные, возвраты, согласия и реквизиты продавца.",
      links: legalLinks,
    },
  ];
}

export function getIndexableSiteMapLinks(): SiteMapLink[] {
  return getSiteMapSections().flatMap((section) => section.links);
}
