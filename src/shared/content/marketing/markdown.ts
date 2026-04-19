import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type MarkdownEntry<T> = {
  slug: string;
  data: T;
  content: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "marketing");
const collectionCache = new Map<string, MarkdownEntry<unknown>[]>();

export function readMarkdownCollection<T extends { order?: number }>(section: string): MarkdownEntry<T>[] {
  const cachedEntries = collectionCache.get(section);

  if (cachedEntries) {
    return cachedEntries as MarkdownEntry<T>[];
  }

  const dirPath = path.join(CONTENT_ROOT, section);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/u, "");
      const source = fs.readFileSync(path.join(dirPath, fileName), "utf8");
      const { data, content } = matter(source);

      return {
        slug,
        data: data as T,
        content: content.trim(),
      };
    })
    .sort((left, right) => {
      const leftOrder = left.data.order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.data.order ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.slug.localeCompare(right.slug);
    });

  collectionCache.set(section, entries as MarkdownEntry<unknown>[]);

  return entries as MarkdownEntry<T>[];
}

export function readMarkdownDocument<T extends { order?: number }>(section: string, slug: string) {
  return readMarkdownCollection<T>(section).find((entry) => entry.slug === slug) ?? null;
}
