import { readMarkdownCollection } from "@/shared/content/marketing/markdown";

export type TemplatePage = {
  slug: string;
  categoryName: string;
  title: string;
  description: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  hero: {
    heading: string;
    subheading: string;
    ctaLabel: string;
  };
  slides: {
    label: string;
    description: string;
  }[];
  useCases: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};

type TemplatePageFrontmatter = Omit<TemplatePage, "slug"> & {
  order?: number;
};

const templatePagesList: TemplatePage[] = readMarkdownCollection<TemplatePageFrontmatter>("templates").map(
  ({ slug, data }) => ({
    slug,
    categoryName: data.categoryName,
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraphTitle: data.openGraphTitle,
    openGraphDescription: data.openGraphDescription,
    hero: data.hero,
    slides: data.slides,
    useCases: data.useCases,
    faq: data.faq,
  }),
);

const templatePages: Record<string, TemplatePage> = Object.fromEntries(
  templatePagesList.map((page) => [page.slug, page]),
);

export function getTemplatePage(slug: string): TemplatePage | undefined {
  return templatePages[slug];
}

export function getAllTemplatePages(): TemplatePage[] {
  return templatePagesList;
}

export function getAllTemplateSlugs(): string[] {
  return templatePagesList.map((page) => page.slug);
}
