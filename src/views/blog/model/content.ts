import type {
  BlogListItem as ApiBlogListItem,
  BlogListResponse,
  BlogSidebarPost as ApiBlogSidebarPost,
  FeaturedBlogPost as ApiFeaturedBlogPost,
} from "@/shared/api";
import {
  blogCategories,
  blogFeedPosts,
  blogPost,
  blogPopularPosts,
  blogTags,
  moreBlogPosts,
  type BlogFeedPost,
  type BlogListPost,
} from "@/entities/blog/model/content";

type BlogFeaturedPost = {
  title: string;
  excerpt: string;
  href: string;
  publishedLabel: string;
  author: string;
  authorInitials: string;
  readingTime: string;
};

type BlogCategoryItem = {
  label: string;
  count: string;
  href: string;
};

type BlogPopularPostItem = {
  title: string;
  meta: string;
  href: string;
};

type BlogTagItem = {
  label: string;
  href: string;
};

export type BlogPageContent = {
  featuredPost: BlogFeaturedPost;
  filterChips: ReadonlyArray<string>;
  feedPosts: ReadonlyArray<BlogFeedPost>;
  morePosts: ReadonlyArray<BlogListPost>;
  categories: ReadonlyArray<BlogCategoryItem>;
  popularPosts: ReadonlyArray<BlogPopularPostItem>;
  tags: ReadonlyArray<BlogTagItem>;
  pagination: {
    page: number;
    totalPages: number;
  };
};

const READ_LABEL = "Читать";
const MIN_LABEL = "мин";
const ALL_LABEL = "Все";
const POPULAR_META = "Популярное";
const AUTHOR = "kartochki.online";
const AUTHOR_INITIALS = "KO";

const visualClasses: ReadonlyArray<BlogFeedPost["visualClass"]> = ["pv2", "pv1", "pv3", "pv4", "pv5", "pv6"];
const visualTones: ReadonlyArray<BlogFeedPost["visualTone"]> = ["ozon", "wb", "both", "tips", "wb", "ozon"];
const visualDecor = ["*", "+", "#", "!", "?", "%"] as const;

export const fallbackBlogPageContent: BlogPageContent = {
  featuredPost: {
    title: blogPost.title,
    excerpt: blogPost.excerpt,
    href: blogPost.canonicalPath,
    publishedLabel: blogPost.publishedLabel,
    author: blogPost.author,
    authorInitials: blogPost.authorInitials,
    readingTime: blogPost.readingTime,
  },
  filterChips: [ALL_LABEL, ...blogCategories.slice(0, 4).map((category) => category.label)],
  feedPosts: blogFeedPosts,
  morePosts: moreBlogPosts,
  categories: blogCategories.map((category) => ({
    label: category.label,
    count: category.count,
    href: "/blog",
  })),
  popularPosts: blogPopularPosts.map((post) => ({
    title: post.title,
    meta: post.meta,
    href: post.href ?? "/blog",
  })),
  tags: blogTags.map((tag) => ({
    label: tag,
    href: "/blog",
  })),
  pagination: {
    page: 1,
    totalPages: 1,
  },
};

export function mapBlogListResponse(response: BlogListResponse): BlogPageContent {
  const posts = response.posts.map(mapFeedPost);

  return {
    featuredPost: mapFeaturedPost(response.featured_post, posts[0]),
    filterChips: [ALL_LABEL, ...response.categories.slice(0, 4).map((category) => category.label)],
    feedPosts: posts.slice(0, 6),
    morePosts: response.posts.slice(6).map(mapListPost),
    categories: response.categories.map((category) => ({
      label: category.label,
      count: String(category.count),
      href: "/blog",
    })),
    popularPosts: response.popular_posts.map(mapPopularPost),
    tags: response.tags.map((tag) => ({
      label: tag.label,
      href: "/blog",
    })),
    pagination: {
      page: response.pagination.page,
      totalPages: response.pagination.total_pages,
    },
  };
}

function mapFeaturedPost(post: ApiFeaturedBlogPost | undefined, firstPost: BlogFeedPost | undefined): BlogFeaturedPost {
  if (!post) {
    return firstPost
      ? {
          title: firstPost.title,
          excerpt: firstPost.excerpt,
          href: firstPost.href ?? "/blog",
          publishedLabel: firstPost.meta,
          author: AUTHOR,
          authorInitials: AUTHOR_INITIALS,
          readingTime: firstPost.readLabel,
        }
      : fallbackBlogPageContent.featuredPost;
  }

  return {
    title: post.title,
    excerpt: post.excerpt,
    href: post.canonical_path,
    publishedLabel: formatDate(post.published_at),
    author: AUTHOR,
    authorInitials: AUTHOR_INITIALS,
    readingTime: formatReadingTime(post.reading_time_minutes),
  };
}

function mapFeedPost(post: ApiBlogListItem, index: number): BlogFeedPost {
  return {
    categoryLabel: post.category_label,
    title: post.title,
    excerpt: post.excerpt,
    meta: `${formatDate(post.published_at)} · ${formatReadingTime(post.reading_time_minutes)}`,
    readLabel: READ_LABEL,
    visualClass: visualClasses[index % visualClasses.length],
    visualLabel: post.category_label,
    visualTone: visualTones[index % visualTones.length],
    decor: visualDecor[index % visualDecor.length],
    href: post.canonical_path,
  };
}

function mapListPost(post: ApiBlogListItem, index: number): BlogListPost {
  return {
    number: String(index + 7).padStart(2, "0"),
    tag: post.category_label,
    title: post.title,
    meta: `${formatDate(post.published_at)} · ${formatReadingTime(post.reading_time_minutes)}`,
    href: post.canonical_path,
  };
}

function mapPopularPost(post: ApiBlogSidebarPost): BlogPopularPostItem {
  return {
    title: post.title,
    meta: POPULAR_META,
    href: post.canonical_path,
  };
}

function formatReadingTime(minutes: number) {
  return `${minutes} ${MIN_LABEL}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}
