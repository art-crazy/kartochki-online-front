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

  const marketplaceGenitive = marketplace.nameGenitive;
  const titleBase = `${template.categoryName.toLowerCase()} для ${marketplaceGenitive}`;

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
      `шаблон карточки ${template.categoryName.toLowerCase()} ${marketplace.name}`,
      ...template.keywords.slice(0, 3),
      ...marketplace.keywords.slice(0, 3),
    ],
    openGraphTitle: `Шаблон карточки ${titleBase}`,
    openGraphDescription: `Готовая структура карточки ${template.categoryName.toLowerCase()} под требования ${marketplaceGenitive}: первый экран, смысловые слайды и логика, которая помогает продавать.`,
    hero: {
      badge: `${marketplace.name} x ${template.categoryName}`,
      heading: `Шаблон карточки ${template.categoryName.toLowerCase()} для ${marketplaceGenitive}`,
      subheading: buildTemplateHeroSubheading(marketplace.slug, marketplace.name, marketplaceGenitive, template.slug),
      ctaLabel: template.hero.ctaLabel,
    },
    sections: {
      title: `Что показать в карточке ${template.categoryName.toLowerCase()} для ${marketplaceGenitive}`,
      items: template.slides.map((slide) => ({
        label: slide.label,
        description: `${slide.description} ${buildTemplateSlideSuffix(marketplace.slug, template.slug, marketplace.name)}`,
      })),
    },
    useCases: {
      title: `Когда шаблон ${template.categoryName.toLowerCase()} особенно полезен на ${marketplace.name}`,
      items: template.useCases,
    },
    faq: [
      {
        question: `Подходит ли этот шаблон для ${marketplaceGenitive}?`,
        answer: `Да. Шаблон собран под ${marketplaceGenitive}: в нем учтены особенности площадки, а структура карточки заточена под категорию ${template.categoryName.toLowerCase()} и сценарии выбора на ${marketplace.name}.`,
      },
      {
        question: `Что именно адаптируется под ${marketplaceGenitive}?`,
        answer:
          marketplace.faq[0]?.answer ??
          `Адаптируются первый экран, логика смысловых блоков, композиция и акценты, которые важны именно для публикации на ${marketplace.name}.`,
      },
      {
        question: "Нужно ли собирать структуру карточки с нуля?",
        answer:
          template.faq[0]?.answer ??
          "Нет. В шаблоне уже есть базовая структура карточки, которую можно быстро адаптировать под товар, бренд и конкретную площадку.",
      },
    ],
  };
}

function buildTemplateHeroSubheading(
  marketplaceSlug: string,
  marketplaceName: string,
  marketplaceGenitive: string,
  templateSlug: string,
) {
  const marketplaceFocus: Record<string, string> = {
    wildberries: "заметную обложку, читаемые выгоды и быстрый выбор в мобильной выдаче",
    ozon: "аккуратную подачу, доверие к товару и понятную последовательность дополнительных слайдов",
    "yandex-market": "ясные характеристики, аргументы и рациональный выбор среди похожих предложений",
  };

  const templateFocus: Record<string, string> = {
    odezhda: "размерную сетку, посадку, ткань и преимущества модели",
    elektronika: "характеристики, комплект, совместимость и реальные сценарии использования",
    kosmetika: "эффект, состав, способ применения и доверие к продукту",
    "tovary-dlya-doma": "размеры, материалы, комплектность и то, как товар выглядит в быту или интерьере",
  };

  return `Готовая структура карточки для продавцов на ${marketplaceName}. Шаблон помогает быстро собрать первый экран и дополнительные слайды так, чтобы через карточку раскрыть ${templateFocus[templateSlug] ?? "ключевые преимущества товара"}, а подача выглядела уместно для ${marketplaceGenitive} с упором на ${marketplaceFocus[marketplaceSlug] ?? "понятную коммерческую подачу"}.`;
}

function buildTemplateSlideSuffix(marketplaceSlug: string, templateSlug: string, marketplaceName: string) {
  const marketplaceSuffix: Record<string, string> = {
    wildberries: `Такой блок помогает быстрее цеплять внимание покупателя в выдаче ${marketplaceName}.`,
    ozon: `Такой блок помогает сделать карточку для ${marketplaceName} аккуратной, понятной и более убедительной.`,
    "yandex-market": `Такой блок помогает покупателю на ${marketplaceName} быстрее сравнить товар и принять решение.`,
  };

  const templateSuffix: Partial<Record<string, string>> = {
    odezhda: "Он особенно полезен там, где нужно снизить сомнения по размеру и посадке.",
    elektronika: "Он особенно полезен там, где решение зависит от параметров и совместимости.",
    kosmetika: "Он особенно полезен там, где важно быстро вызвать доверие к составу и эффекту.",
    "tovary-dlya-doma": "Он особенно полезен там, где важно показать размеры и контекст использования.",
  };

  return [marketplaceSuffix[marketplaceSlug], templateSuffix[templateSlug]].filter(Boolean).join(" ");
}
