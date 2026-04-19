import { readMarkdownCollection } from "@/shared/content/marketing/markdown";
import type { MarkdownBlogPost } from "./toc";
export { slugifyHeading, getMarkdownBlogToc, type MarkdownBlogTocItem, type MarkdownBlogPost } from "./toc";

type BlogTagTone = "wb" | "ozon" | "ym" | "accent";

type BlogMarkdownFrontmatter = {
  order?: number;
  title: string;
  description: string;
  excerpt: string;
  categoryLabel: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorInitials: string;
  readingTimeMinutes: number;
  views: string;
  heroCaption: string;
  tags: {
    label: string;
    tone: BlogTagTone;
  }[];
  footerTags: string[];
  keywords: string[];
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function mapBlogPost(slug: string, data: BlogMarkdownFrontmatter, content: string): MarkdownBlogPost {
  return {
    slug,
    title: data.title,
    description: data.description,
    excerpt: data.excerpt,
    canonicalPath: `/blog/${slug}`,
    categoryLabel: data.categoryLabel,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    publishedLabel: formatDate(data.publishedAt),
    updatedLabel: formatDate(data.updatedAt),
    listMeta: `${formatShortDate(data.publishedAt)} · ${data.readingTimeMinutes} мин`,
    author: data.author,
    authorInitials: data.authorInitials,
    readingTime: `${data.readingTimeMinutes} мин`,
    readingTimeMinutes: data.readingTimeMinutes,
    views: data.views,
    heroCaption: data.heroCaption,
    tags: data.tags,
    footerTags: data.footerTags,
    keywords: data.keywords,
    content,
  };
}

export function getAllMarkdownBlogPosts(): MarkdownBlogPost[] {
  return readMarkdownCollection<BlogMarkdownFrontmatter>("blog").map(({ slug, data, content }) =>
    mapBlogPost(slug, data, content),
  );
}

