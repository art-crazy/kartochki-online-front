import { odezhda } from "./data/odezhda";
import { elektronika } from "./data/elektronika";
import { kosmetika } from "./data/kosmetika";
import { tovaryDlyaDoma } from "./data/tovary-dlya-doma";

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

const templatePagesList: TemplatePage[] = [odezhda, elektronika, kosmetika, tovaryDlyaDoma];

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
