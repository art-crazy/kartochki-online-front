import { readMarkdownCollection } from "@/shared/content/marketing/markdown";

export type ToolPage = {
  slug: string;
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
  howItWorks: {
    step: string;
    title: string;
    description: string;
  }[];
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
};

type ToolPageFrontmatter = Omit<ToolPage, "slug"> & {
  order?: number;
};

const toolPagesList: ToolPage[] = readMarkdownCollection<ToolPageFrontmatter>("tools").map(({ slug, data }) => ({
  slug,
  title: data.title,
  description: data.description,
  keywords: data.keywords,
  openGraphTitle: data.openGraphTitle,
  openGraphDescription: data.openGraphDescription,
  hero: data.hero,
  howItWorks: data.howItWorks,
  features: data.features,
  faq: data.faq,
}));

const toolPages: Record<string, ToolPage> = Object.fromEntries(toolPagesList.map((page) => [page.slug, page]));

export function getToolPage(slug: string): ToolPage | undefined {
  return toolPages[slug];
}

export function getAllToolPages(): ToolPage[] {
  return toolPagesList;
}

export function getAllToolSlugs(): string[] {
  return toolPagesList.map((page) => page.slug);
}
