import { siteConfig } from "@/shared/config/site";
import { seoPublisher } from "@/shared/config/seo";
import { buildCanonicalUrl } from "./metadata";
import { buildItemListSchema } from "./structured-data";

type FaqEntry = {
  question: string;
  answer: string;
};

type SoftwareApplicationInput = {
  name: string;
  description: string;
  path: string;
};

type CollectionPageInput = {
  name: string;
  description: string;
  path: string;
  items: ReadonlyArray<{
    label: string;
    href: string;
  }>;
};

export function buildFaqPageSchema(items: ReadonlyArray<FaqEntry>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;
}

export function buildSoftwareApplicationSchema({
  name,
  description,
  path,
}: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "ru",
    url: buildCanonicalUrl(path),
    description,
    publisher: seoPublisher,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
  } as const;
}

export function buildCollectionPageSchema({
  name,
  description,
  path,
  items,
}: CollectionPageInput) {
  const itemListSchema = omitContext(buildItemListSchema(name, items));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: buildCanonicalUrl(path),
    inLanguage: "ru",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.applicationName,
      url: buildCanonicalUrl("/"),
    },
    publisher: seoPublisher,
    mainEntity: itemListSchema,
  } as const;
}

function omitContext<T extends { "@context"?: string }>(schema: T): Omit<T, "@context"> {
  const { "@context": _context, ...rest } = schema;
  return rest;
}
