import {
  getMarketplaceToolLinksForMarketplace,
  getMarketplaceToolLinksForTool,
} from "./internal-linking-marketplace-tools";
import {
  getMarketplaceTemplateLinksForMarketplace,
  getMarketplaceTemplateLinksForTemplate,
} from "./internal-linking-marketplace-templates";

export type SeoLinkItem = {
  href: string;
  label: string;
  description: string;
};

export type SeoLinkGroup = {
  title: string;
  links: readonly SeoLinkItem[];
};

const marketplaceLinks = {
  wildberries: {
    href: "/marketplaces/wildberries",
    label: "Карточки для Wildberries",
    description: "Требования WB, размеры изображений и сценарии генерации карточек под каталог и рекламу.",
  },
  ozon: {
    href: "/marketplaces/ozon",
    label: "Карточки для Ozon",
    description: "Форматы Ozon, фото на белом фоне, rich-контент и адаптация визуалов под конверсию.",
  },
  yandexMarket: {
    href: "/marketplaces/yandex-market",
    label: "Карточки для Яндекс Маркета",
    description: "Подготовка изображений, инфографики и медиа для карточек в Яндекс Маркете.",
  },
} as const;

const toolLinks = {
  generator: {
    href: "/tools/generator-kartochek",
    label: "Генератор карточек товаров",
    description: "Генерация готовых карточек для маркетплейсов из фото товара и описания.",
  },
  infographics: {
    href: "/tools/infografika",
    label: "Инфографика для маркетплейсов",
    description: "Слайды с выгодами, составом, размерами и акцентами для повышения CTR и конверсии.",
  },
} as const;

const templateLinks = {
  odezhda: {
    href: "/templates/odezhda",
    label: "Шаблоны для одежды",
    description: "Готовые структуры карточек для одежды: размеры, ткани, посадка и ключевые преимущества товара.",
  },
  elektronika: {
    href: "/templates/elektronika",
    label: "Шаблоны для электроники",
    description: "Шаблоны с акцентом на характеристики, комплектацию, сценарии использования и сравнение.",
  },
  kosmetika: {
    href: "/templates/kosmetika",
    label: "Шаблоны для косметики",
    description: "Карточки для косметики с составом, эффектом, способом применения и преимуществами.",
  },
  tovaryDlyaDoma: {
    href: "/templates/tovary-dlya-doma",
    label: "Шаблоны для товаров для дома",
    description: "Карточки с размерами, материалами, комплектностью и сценариями использования в интерьере.",
  },
} as const;

const blogLinks = {
  hub: {
    href: "/blog",
    label: "Блог для продавцов маркетплейсов",
    description: "Гайды по фото, инфографике, SEO карточек и требованиям Wildberries, Ozon и Яндекс Маркета.",
  },
  requirements2025: {
    href: "/blog/trebovaniya-foto-marketplejsy-2025",
    label: "Требования к фото маркетплейсов 2025",
    description: "Сводный материал по требованиям WB, Ozon и Яндекс Маркета к фото и оформлению карточек.",
  },
} as const;

function withoutCurrent(groups: readonly SeoLinkGroup[], currentHref?: string): SeoLinkGroup[] {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.href !== currentHref),
    }))
    .filter((group) => group.links.length > 0);
}

export function getHomeLinkGroups(): SeoLinkGroup[] {
  return [
    {
      title: "Разделы по маркетплейсам",
      links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket],
    },
    {
      title: "Инструменты для разных задач",
      links: [toolLinks.generator, toolLinks.infographics],
    },
    {
      title: "Шаблоны по категориям",
      links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
    },
  ];
}

export function getMarketplacesHubLinkGroups(): SeoLinkGroup[] {
  return [
    {
      title: "Страницы маркетплейсов",
      links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket],
    },
    {
      title: "Инструменты для подготовки карточек",
      links: [toolLinks.generator, toolLinks.infographics],
    },
    {
      title: "Шаблоны по категориям товара",
      links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
    },
  ];
}

export function getTemplatesHubLinkGroups(): SeoLinkGroup[] {
  return [
    {
      title: "Шаблоны карточек",
      links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
    },
    {
      title: "Под какой маркетплейс адаптировать",
      links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket],
    },
    {
      title: "Инструменты для доработки",
      links: [toolLinks.generator, toolLinks.infographics],
    },
  ];
}

export function getToolsHubLinkGroups(): SeoLinkGroup[] {
  return [
    {
      title: "Инструменты",
      links: [toolLinks.generator, toolLinks.infographics],
    },
    {
      title: "Маркетплейсы и требования",
      links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket],
    },
    {
      title: "Готовые шаблоны",
      links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
    },
  ];
}

export function getMarketplacePageLinkGroups(slug: string): SeoLinkGroup[] {
  const currentHref = `/marketplaces/${slug}`;

  return withoutCurrent(
    [
      {
        title: "Инструменты для этой площадки",
        links: getMarketplaceToolLinksForMarketplace(slug),
      },
      {
        title: "Шаблоны, которые обычно используют продавцы",
        links: getMarketplaceTemplateLinksForMarketplace(slug),
      },
      {
        title: "Смежные страницы и гайды",
        links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket, blogLinks.requirements2025],
      },
    ],
    currentHref,
  );
}

export function getToolPageLinkGroups(slug: string): SeoLinkGroup[] {
  const currentHref = `/tools/${slug}`;

  const toolSpecificTemplates: Record<string, readonly SeoLinkItem[]> = {
    "generator-kartochek": [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika],
    infografika: [templateLinks.kosmetika, templateLinks.elektronika, templateLinks.tovaryDlyaDoma],
  };

  return withoutCurrent(
    [
      {
        title: "Куда применять инструмент",
        links: getMarketplaceToolLinksForTool(slug),
      },
      {
        title: "Подходящие шаблоны",
        links: toolSpecificTemplates[slug] ?? [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika],
      },
      {
        title: "Смежные коммерческие страницы",
        links: [toolLinks.generator, toolLinks.infographics, blogLinks.requirements2025],
      },
    ],
    currentHref,
  );
}

export function getTemplatePageLinkGroups(slug: string): SeoLinkGroup[] {
  const currentHref = `/templates/${slug}`;

  return withoutCurrent(
    [
      {
        title: "Похожие шаблоны",
        links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
      },
      {
        title: "Маркетплейсы для адаптации карточек",
        links: getMarketplaceTemplateLinksForTemplate(slug),
      },
      {
        title: "Инструменты для финальной сборки",
        links: [toolLinks.generator, toolLinks.infographics],
      },
    ],
    currentHref,
  );
}

export function getBlogHubCommercialLinkGroups(): SeoLinkGroup[] {
  return [
    {
      title: "Коммерческие страницы сервиса",
      links: [toolLinks.generator, toolLinks.infographics, marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket],
    },
    {
      title: "Шаблоны карточек по категориям",
      links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
    },
  ];
}

export function getBlogPostCommercialLinkGroups(currentHref?: string): SeoLinkGroup[] {
  return withoutCurrent(
    [
      {
        title: "Перейти в коммерческие хабы",
        links: [marketplaceLinks.wildberries, marketplaceLinks.ozon, marketplaceLinks.yandexMarket, toolLinks.generator, toolLinks.infographics],
      },
      {
        title: "Выбрать шаблон карточки",
        links: [templateLinks.odezhda, templateLinks.elektronika, templateLinks.kosmetika, templateLinks.tovaryDlyaDoma],
      },
      {
        title: "Ещё полезные страницы",
        links: [blogLinks.hub, blogLinks.requirements2025],
      },
    ],
    currentHref,
  );
}
