import { getAllMarketplacePages, getMarketplacePage, type MarketplaceTone } from "@/views/marketplace-landing/model/marketplaces";
import { getAllTemplatePages, getTemplatePage } from "@/views/template-landing/model/templates";

type MarketplaceTemplateFaq = {
  question: string;
  answer: string;
};

type MarketplaceTemplateSlide = {
  label: string;
  description: string;
};

export type MarketplaceTemplateLanding = {
  marketplaceSlug: string;
  templateSlug: string;
  tone: MarketplaceTone;
  marketplaceName: string;
  templateName: string;
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
  sections: {
    title: string;
    items: MarketplaceTemplateSlide[];
  };
  useCases: {
    title: string;
    items: string[];
  };
  faq: MarketplaceTemplateFaq[];
};

export function buildMarketplaceTemplateHref(marketplaceSlug: string, templateSlug: string) {
  return `/marketplaces/${marketplaceSlug}/templates/${templateSlug}`;
}

export function getAllMarketplaceTemplateParams() {
  return getAllMarketplacePages().flatMap((marketplace) =>
    getAllTemplatePages().map((template) => ({
      marketplaceSlug: marketplace.slug,
      templateSlug: template.slug,
    })),
  );
}

export function getMarketplaceTemplateLanding(
  marketplaceSlug: string,
  templateSlug: string,
): MarketplaceTemplateLanding | null {
  const marketplace = getMarketplacePage(marketplaceSlug);
  const template = getTemplatePage(templateSlug);

  if (!marketplace || !template) {
    return null;
  }

  const titleBase = `${template.categoryName} для ${marketplace.name}`;

  return {
    marketplaceSlug,
    templateSlug,
    tone: marketplace.tone,
    marketplaceName: marketplace.name,
    templateName: template.categoryName,
    title: `Шаблон карточки ${titleBase} | kartochki.online`,
    description: `Шаблон карточки ${titleBase}: ${template.description}`,
    keywords: [
      `${template.categoryName} ${marketplace.name}`,
      `шаблон карточки ${template.categoryName} ${marketplace.name}`,
      ...template.keywords.slice(0, 3),
      ...marketplace.keywords.slice(0, 3),
    ],
    openGraphTitle: `Шаблон карточки ${titleBase}`,
    openGraphDescription: `Готовая структура карточки ${template.categoryName} под требования ${marketplace.name}.`,
    hero: {
      badge: `${marketplace.name} × ${template.categoryName}`,
      heading: `Шаблон карточки ${template.categoryName} для ${marketplace.name}`,
      subheading: `Категорийная посадочная для продавцов на ${marketplace.name}. Внутри уже собрана логика структуры, релевантные блоки карточки и подача под требования площадки.`,
      ctaLabel: template.hero.ctaLabel,
    },
    sections: {
      title: `Структура шаблона для ${marketplace.name}`,
      items: template.slides.map((slide) => ({
        label: slide.label,
        description: `${slide.description} Блок адаптирован под публикацию на ${marketplace.name}.`,
      })),
    },
    useCases: {
      title: `Для каких товаров на ${marketplace.name} подходит шаблон`,
      items: template.useCases,
    },
    faq: [
      {
        question: `Подходит ли этот шаблон для ${marketplace.name}?`,
        answer: `Да. Страница собрана под ${marketplace.name}: в шаблоне учтены особенности площадки, а сам сценарий заточен под категорию ${template.categoryName}.`,
      },
      {
        question: `Что адаптируется под ${marketplace.name}?`,
        answer:
          marketplace.faq[0]?.answer ??
          `Формат подачи, ограничения по оформлению и логика контентных блоков, которые важны для ${marketplace.name}.`,
      },
      {
        question: `Нужно ли собирать структуру карточки с нуля?`,
        answer:
          template.faq[0]?.answer ??
          `Нет. В шаблоне уже есть базовая структура карточки, которую можно быстро адаптировать под товар и площадку.`,
      },
    ],
  };
}
