type BlogTagTone = "wb" | "ozon" | "ym" | "accent";

export type MarkdownBlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  canonicalPath: string;
  categoryLabel: string;
  publishedAt: string;
  updatedAt: string;
  publishedLabel: string;
  updatedLabel: string;
  listMeta: string;
  author: string;
  authorInitials: string;
  readingTime: string;
  readingTimeMinutes: number;
  views: string;
  heroCaption: string;
  tags: {
    label: string;
    tone: BlogTagTone;
  }[];
  footerTags: string[];
  keywords: string[];
  content: string;
};

export type MarkdownBlogTocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`"'.,!?():[\]]/gu, "")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function getMarkdownBlogToc(content: string): MarkdownBlogTocItem[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^###+\s/u.test(line))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const label = line.replace(/^###?\s+/u, "");

      return {
        id: slugifyHeading(label),
        label,
        level,
      } satisfies MarkdownBlogTocItem;
    });
}
