import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { buildSiteUrl } from "../../config/site.ts";
import {
  SITEMAP_BLOG_POST_DETAIL_SOURCES,
  SITEMAP_COLLECTION_ROUTES,
  SITEMAP_CONFIG_SOURCES,
  SITEMAP_MARKETPLACE_DETAIL_SOURCES,
  SITEMAP_MARKETPLACE_TEMPLATE_DETAIL_SOURCES,
  SITEMAP_MARKETPLACE_TOOL_DETAIL_SOURCES,
  SITEMAP_OUTPUT_PATH,
  SITEMAP_STATIC_ROUTES,
  SITEMAP_TEMPLATE_DETAIL_SOURCES,
  SITEMAP_TOOL_DETAIL_SOURCES,
  type SitemapChangeFrequency,
} from "./config.ts";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: SitemapChangeFrequency;
  lastmod: string;
};

type MarkdownDocument = {
  slug: string;
  filePath: string;
  mtime: Date;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "marketing");
const projectRoot = process.cwd();
const fileMtimeCache = new Map<string, Date>();
const sharedConfigDates = SITEMAP_CONFIG_SOURCES.map((sourcePath) => getFileMtime(sourcePath));

function getAbsolutePath(relativePath: string) {
  return path.join(projectRoot, relativePath);
}

function getFileMtime(relativePath: string) {
  const cached = fileMtimeCache.get(relativePath);

  if (cached) {
    return cached;
  }

  const mtime = fs.statSync(getAbsolutePath(relativePath)).mtime;
  fileMtimeCache.set(relativePath, mtime);
  return mtime;
}

function getMaxDate(dates: readonly Date[]) {
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function formatLastmod(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseFrontmatterDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function readMarkdownDocuments(section: "marketplaces" | "tools" | "templates" | "blog"): MarkdownDocument[] {
  const sectionDir = path.join(CONTENT_ROOT, section);

  if (!fs.existsSync(sectionDir)) {
    return [];
  }

  return fs
    .readdirSync(sectionDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const filePath = path.join(sectionDir, fileName);

      return {
        slug: fileName.replace(/\.md$/u, ""),
        filePath,
        mtime: fs.statSync(filePath).mtime,
      };
    });
}

function getSourceDates(sourcePaths: readonly string[]) {
  return sourcePaths.map((sourcePath) => getFileMtime(sourcePath));
}

function buildStaticEntries(): SitemapEntry[] {
  return SITEMAP_STATIC_ROUTES.map((route) => ({
    path: route.path,
    priority: route.priority,
    changeFrequency: route.changeFrequency,
    lastmod: formatLastmod(getMaxDate([...sharedConfigDates, ...getSourceDates(route.sourcePaths)])),
  }));
}

function buildBlogPostEntries(documents: readonly MarkdownDocument[]): SitemapEntry[] {
  const sourceDates = getSourceDates(SITEMAP_BLOG_POST_DETAIL_SOURCES);

  return documents.map((doc) => {
    const source = fs.readFileSync(doc.filePath, "utf8");
    const { data } = matter(source);
    const contentDate = parseFrontmatterDate(data.updatedAt) ?? parseFrontmatterDate(data.publishedAt) ?? doc.mtime;

    return {
      path: `/blog/${doc.slug}`,
      priority: 0.76,
      changeFrequency: "weekly",
      lastmod: formatLastmod(getMaxDate([...sharedConfigDates, ...sourceDates, contentDate])),
    };
  });
}

function buildMarketplaceToolEntries(
  marketplaceDocs: readonly MarkdownDocument[],
  toolDocs: readonly MarkdownDocument[],
): SitemapEntry[] {
  const sourceDates = getSourceDates(SITEMAP_MARKETPLACE_TOOL_DETAIL_SOURCES);

  return marketplaceDocs.flatMap((marketplaceDoc) =>
    toolDocs.map((toolDoc) => ({
      path: `/marketplaces/${marketplaceDoc.slug}/tools/${toolDoc.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastmod: formatLastmod(getMaxDate([...sharedConfigDates, ...sourceDates, marketplaceDoc.mtime, toolDoc.mtime])),
    })),
  );
}

function buildMarketplaceTemplateEntries(
  marketplaceDocs: readonly MarkdownDocument[],
  templateDocs: readonly MarkdownDocument[],
): SitemapEntry[] {
  const sourceDates = getSourceDates(SITEMAP_MARKETPLACE_TEMPLATE_DETAIL_SOURCES);

  return marketplaceDocs.flatMap((marketplaceDoc) =>
    templateDocs.map((templateDoc) => ({
      path: `/marketplaces/${marketplaceDoc.slug}/templates/${templateDoc.slug}`,
      priority: 0.68,
      changeFrequency: "monthly",
      lastmod: formatLastmod(getMaxDate([...sharedConfigDates, ...sourceDates, marketplaceDoc.mtime, templateDoc.mtime])),
    })),
  );
}

function buildCollectionEntries(): SitemapEntry[] {
  const collections = new Map(
    (["marketplaces", "tools", "templates", "blog"] as const).map((section) => [section, readMarkdownDocuments(section)]),
  );

  const indexEntries = SITEMAP_COLLECTION_ROUTES.map((route) => {
    const docs = collections.get(route.section) ?? [];
    const dates = docs.map((doc) => doc.mtime);
    const sourceDates = getSourceDates(route.sourcePaths);

    return {
      path: route.path,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
      lastmod: formatLastmod(
        getMaxDate([...sharedConfigDates, ...sourceDates, ...(dates.length > 0 ? dates : sharedConfigDates)]),
      ),
    } satisfies SitemapEntry;
  });

  return [
    ...indexEntries,
    ...(collections.get("marketplaces") ?? []).map(
      (doc) =>
        ({
          path: `/marketplaces/${doc.slug}`,
          priority: 0.8,
          changeFrequency: "monthly",
          lastmod: formatLastmod(
            getMaxDate([...sharedConfigDates, ...getSourceDates(SITEMAP_MARKETPLACE_DETAIL_SOURCES), doc.mtime]),
          ),
        }) satisfies SitemapEntry,
    ),
    ...(collections.get("tools") ?? []).map(
      (doc) =>
        ({
          path: `/tools/${doc.slug}`,
          priority: 0.78,
          changeFrequency: "monthly",
          lastmod: formatLastmod(
            getMaxDate([...sharedConfigDates, ...getSourceDates(SITEMAP_TOOL_DETAIL_SOURCES), doc.mtime]),
          ),
        }) satisfies SitemapEntry,
    ),
    ...(collections.get("templates") ?? []).map(
      (doc) =>
        ({
          path: `/templates/${doc.slug}`,
          priority: 0.74,
          changeFrequency: "monthly",
          lastmod: formatLastmod(
            getMaxDate([...sharedConfigDates, ...getSourceDates(SITEMAP_TEMPLATE_DETAIL_SOURCES), doc.mtime]),
          ),
        }) satisfies SitemapEntry,
    ),
    ...buildBlogPostEntries(collections.get("blog") ?? []),
    ...buildMarketplaceToolEntries(collections.get("marketplaces") ?? [], collections.get("tools") ?? []),
    ...buildMarketplaceTemplateEntries(collections.get("marketplaces") ?? [], collections.get("templates") ?? []),
  ];
}

function dedupeAndSort(entries: readonly SitemapEntry[]) {
  return Array.from(new Map(entries.map((entry) => [entry.path, entry])).values()).sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

export function buildSitemapEntries() {
  return dedupeAndSort([...buildStaticEntries(), ...buildCollectionEntries()]);
}

export function buildSitemapXml(entries: readonly SitemapEntry[]) {
  const urlset = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(buildSiteUrl(entry.path))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

export function writeSitemapFile() {
  const entries = buildSitemapEntries();
  const outputPath = getAbsolutePath(SITEMAP_OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buildSitemapXml(entries), "utf8");
  return entries.length;
}
