import { getAllMarkdownBlogPosts, type MarkdownBlogPost } from "./markdown";

export type BlogPostEntry = MarkdownBlogPost;

export type BlogFeedPost = {
  categoryLabel: string;
  title: string;
  excerpt: string;
  meta: string;
  readLabel: string;
  visualClass: "pv1" | "pv2" | "pv3" | "pv4" | "pv5" | "pv6";
  visualLabel: string;
  visualTone: "wb" | "ozon" | "both" | "tips";
  decor: string;
  href?: string;
};

export type BlogListPost = {
  number: string;
  tag: string;
  title: string;
  meta: string;
  href?: string;
};

export type BlogSidebarPost = {
  title: string;
  meta: string;
  href?: string;
};

export type BlogTableCellTone = "success" | "muted";

const visualClasses: ReadonlyArray<BlogFeedPost["visualClass"]> = ["pv1", "pv2", "pv3", "pv4", "pv5", "pv6"];
const visualTones: ReadonlyArray<BlogFeedPost["visualTone"]> = ["wb", "ozon", "both", "tips", "wb", "ozon"];
const visualDecor = ["*", "+", "#", "!", "?", "%"] as const;

export const allBlogPosts = getAllMarkdownBlogPosts();
export const blogPost: MarkdownBlogPost = allBlogPosts[0] ?? {
  slug: "blog",
  title: "Блог kartochki.online",
  description: "Практические статьи для продавцов на маркетплейсах.",
  excerpt: "Практические статьи для продавцов на маркетплейсах.",
  canonicalPath: "/blog",
  categoryLabel: "Блог",
  publishedAt: "2026-01-01",
  updatedAt: "2026-01-01",
  publishedLabel: "1 января 2026",
  updatedLabel: "1 января 2026",
  listMeta: "1 янв · 5 мин",
  author: "Редакция kartochki.online",
  authorInitials: "KO",
  readingTime: "5 мин",
  readingTimeMinutes: 5,
  views: "0",
  heroCaption: "Практические материалы для продавцов на маркетплейсах.",
  tags: [{ label: "Блог", tone: "accent" }],
  footerTags: ["Блог"],
  keywords: ["блог"],
  content: "## Блог\n\nМатериалы для продавцов на маркетплейсах.",
};
export const blogPostSlugs = allBlogPosts.map((post) => post.slug);

export const blogHeroStats = [
  { value: String(allBlogPosts.length), label: "статьи" },
  { value: `${Math.max(allBlogPosts.length * 3, 1)}к`, label: "читателей" },
];

const categoryCounts = allBlogPosts.reduce<Record<string, number>>((acc, post) => {
  acc[post.categoryLabel] = (acc[post.categoryLabel] ?? 0) + 1;
  return acc;
}, {});

export const blogCategories = Object.entries(categoryCounts).map(([label, count]) => ({
  label,
  count: String(count),
}));

const tagCounts = allBlogPosts.reduce<Record<string, number>>((acc, post) => {
  post.tags.forEach((tag) => {
    acc[tag.label] = (acc[tag.label] ?? 0) + 1;
  });
  return acc;
}, {});

export const blogTags = Object.keys(tagCounts);

export const blogFeedPosts: readonly BlogFeedPost[] = allBlogPosts.slice(0, 6).map((post, index) => ({
  categoryLabel: post.categoryLabel,
  title: post.title,
  excerpt: post.excerpt,
  meta: post.listMeta,
  readLabel: "Читать",
  visualClass: visualClasses[index % visualClasses.length],
  visualLabel: post.tags[0]?.label ?? post.categoryLabel,
  visualTone: visualTones[index % visualTones.length],
  decor: visualDecor[index % visualDecor.length],
  href: post.canonicalPath,
}));

export const moreBlogPosts: readonly BlogListPost[] = allBlogPosts.slice(6).map((post, index) => ({
  number: String(index + 7).padStart(2, "0"),
  tag: post.categoryLabel,
  title: post.title,
  meta: post.listMeta,
  href: post.canonicalPath,
}));

export const blogPopularPosts: readonly BlogSidebarPost[] = allBlogPosts.slice(0, 4).map((post) => ({
  title: post.title,
  meta: `${post.views} просмотров`,
  href: post.canonicalPath,
}));

export const heroGradients = [
  "linear-gradient(135deg, #0f3460, #e94560)",
  "linear-gradient(135deg, #1a472a, #52b788)",
  "linear-gradient(135deg, #2d1b69, #f5a623)",
  "linear-gradient(135deg, #2c3e50, #f39c12)",
  "linear-gradient(135deg, #6a0572, #e040fb)",
  "linear-gradient(135deg, #1b4332, #95d5b2)",
];

export function getBlogPostBySlug(slug: string) {
  return allBlogPosts.find((post) => post.slug === slug) ?? null;
}
