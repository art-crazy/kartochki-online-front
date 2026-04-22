export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapStaticRoute = {
  path: string;
  priority: number;
  changeFrequency: SitemapChangeFrequency;
  sourcePaths: string[];
};

export type SitemapCollectionRoute = {
  path: string;
  section: "marketplaces" | "tools" | "templates" | "blog";
  priority: number;
  changeFrequency: SitemapChangeFrequency;
  sourcePaths: string[];
};

export const SITEMAP_OUTPUT_PATH = "public/sitemap.xml";

export const SITEMAP_STATIC_ROUTES: readonly SitemapStaticRoute[] = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
    sourcePaths: [
      "src/app/(marketing)/page.tsx",
      "src/views/home/ui/HomePage.tsx",
      "src/widgets/marketing/home/model/content.ts",
      "src/shared/seo/internal-linking.ts",
    ],
  },
  {
    path: "/sitemap",
    priority: 0.35,
    changeFrequency: "monthly",
    sourcePaths: ["src/app/(marketing)/sitemap/page.tsx", "src/views/site-map/model/siteMap.ts"],
  },
  {
    path: "/oferta",
    priority: 0.45,
    changeFrequency: "yearly",
    sourcePaths: ["src/app/(marketing)/oferta/page.tsx", "src/views/legal/model/legalDocuments.ts"],
  },
  {
    path: "/privacy",
    priority: 0.45,
    changeFrequency: "yearly",
    sourcePaths: ["src/app/(marketing)/privacy/page.tsx", "src/views/legal/model/legalDocuments.ts"],
  },
  {
    path: "/consent",
    priority: 0.4,
    changeFrequency: "yearly",
    sourcePaths: ["src/app/(marketing)/consent/page.tsx", "src/views/legal/model/legalDocuments.ts"],
  },
  {
    path: "/vozvrat",
    priority: 0.45,
    changeFrequency: "yearly",
    sourcePaths: ["src/app/(marketing)/vozvrat/page.tsx", "src/views/legal/model/legalDocuments.ts"],
  },
  {
    path: "/rekvizity",
    priority: 0.4,
    changeFrequency: "yearly",
    sourcePaths: ["src/app/(marketing)/rekvizity/page.tsx", "src/views/legal/model/legalNotices.ts"],
  },
] as const;

export const SITEMAP_COLLECTION_ROUTES: readonly SitemapCollectionRoute[] = [
  {
    path: "/marketplaces",
    section: "marketplaces",
    priority: 0.9,
    changeFrequency: "monthly",
    sourcePaths: ["src/app/(marketing)/marketplaces/page.tsx", "src/views/marketplace-landing/ui/MarketplacesIndexPage.tsx"],
  },
  {
    path: "/tools",
    section: "tools",
    priority: 0.85,
    changeFrequency: "monthly",
    sourcePaths: ["src/app/(marketing)/tools/page.tsx", "src/views/tool-landing/ui/ToolsIndexPage.tsx"],
  },
  {
    path: "/templates",
    section: "templates",
    priority: 0.8,
    changeFrequency: "monthly",
    sourcePaths: ["src/app/(marketing)/templates/page.tsx", "src/views/template-landing/ui/TemplatesIndexPage.tsx"],
  },
  {
    path: "/blog",
    section: "blog",
    priority: 0.8,
    changeFrequency: "weekly",
    sourcePaths: [
      "src/app/(marketing)/blog/page.tsx",
      "src/views/blog/model/content.ts",
      "src/views/blog/ui/BlogPage.tsx",
    ],
  },
] as const;

export const SITEMAP_CONFIG_SOURCES = [
  "src/shared/seo/sitemap/config.ts",
  "src/shared/config/site.ts",
] as const;

export const SITEMAP_MARKETPLACE_DETAIL_SOURCES = [
  "src/app/(marketing)/marketplaces/[slug]/page.tsx",
  "src/views/marketplace-landing/model/marketplaces.ts",
  "src/views/marketplace-landing/ui/MarketplacePage.tsx",
] as const;

export const SITEMAP_TOOL_DETAIL_SOURCES = [
  "src/app/(marketing)/tools/[slug]/page.tsx",
  "src/views/tool-landing/model/tools.ts",
  "src/views/tool-landing/ui/ToolPage.tsx",
] as const;

export const SITEMAP_TEMPLATE_DETAIL_SOURCES = [
  "src/app/(marketing)/templates/[slug]/page.tsx",
  "src/views/template-landing/model/templates.ts",
  "src/views/template-landing/ui/TemplatePage.tsx",
] as const;

export const SITEMAP_MARKETPLACE_TOOL_DETAIL_SOURCES = [
  "src/app/(marketing)/marketplaces/[slug]/tools/[toolSlug]/page.tsx",
  "src/views/marketplace-tool-landing/model/solutions.ts",
  "src/views/marketplace-tool-landing/ui/MarketplaceToolPage.tsx",
] as const;

export const SITEMAP_MARKETPLACE_TEMPLATE_DETAIL_SOURCES = [
  "src/app/(marketing)/marketplaces/[slug]/templates/[templateSlug]/page.tsx",
  "src/views/marketplace-template-landing/model/solutions.ts",
  "src/views/marketplace-template-landing/ui/MarketplaceTemplatePage.tsx",
] as const;

export const SITEMAP_BLOG_POST_DETAIL_SOURCES = [
  "src/app/(marketing)/blog/[slug]/page.tsx",
  "src/views/blog-post/model/server.ts",
  "src/views/blog-post/ui/BlogPostPage.tsx",
  "src/views/blog-post/ui/ApiBlogPostPage.tsx",
] as const;
