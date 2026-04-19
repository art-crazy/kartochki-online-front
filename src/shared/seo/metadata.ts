import type { Metadata } from "next";
import { buildSiteUrl } from "@/shared/config/site";

type MetadataRobots = NonNullable<Metadata["robots"]>;

type BaseMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: Metadata["keywords"];
  robots?: MetadataRobots;
  openGraphTitle?: string;
  openGraphDescription?: string;
};

type ArticleMetadataInput = BaseMetadataInput & {
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildCanonicalUrl(path = "/") {
  return buildSiteUrl(path);
}

export function buildNoindexRobots(): MetadataRobots {
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}

export function buildIndexRobots(): MetadataRobots {
  return {
    index: true,
    follow: true,
  };
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords,
  robots,
  openGraphTitle,
  openGraphDescription,
}: BaseMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(path);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? description,
      url: canonical,
    },
    ...(robots ? { robots } : {}),
  };
}

export function buildArticleMetadata({
  title,
  description,
  path,
  keywords,
  robots,
  openGraphTitle,
  openGraphDescription,
  publishedTime,
  modifiedTime,
}: ArticleMetadataInput): Metadata {
  const canonical = buildCanonicalUrl(path);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? description,
      url: canonical,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    ...(robots ? { robots } : {}),
  };
}

export function buildNoindexMetadata(input: BaseMetadataInput): Metadata {
  return buildPageMetadata({
    ...input,
    robots: buildNoindexRobots(),
  });
}
