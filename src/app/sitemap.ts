import type { MetadataRoute } from "next";
import { buildSiteUrl } from "@/shared/config/site";
import { getAllMarketplaceSlugs } from "@/views/marketplace-landing/model/marketplaces";
import { getAllTemplateSlugs } from "@/views/template-landing/model/templates";
import { getAllToolSlugs } from "@/views/tool-landing/model/tools";
import { getAllMarketplaceTemplateParams } from "@/views/marketplace-template-landing/model/solutions";
import { getAllMarketplaceToolParams } from "@/views/marketplace-tool-landing/model/solutions";
import { allBlogPosts } from "@/entities/blog/model/content";
import { listPublicBlogPosts, type BlogListItem } from "@/shared/api";

export const revalidate = 86_400;

async function fetchAllApiBlogPosts(): Promise<BlogListItem[]> {
  const posts: BlogListItem[] = [];
  let page = 1;

  try {
    while (true) {
      const { data } = await listPublicBlogPosts({
        query: { page, page_size: 100 },
        throwOnError: true,
      });

      if (!data?.posts.length) break;
      posts.push(...data.posts);
      if (page >= data.pagination.total_pages) break;
      page++;
    }
  } catch {
    // API недоступен при генерации — статические посты подхватят дальше
  }

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: buildSiteUrl("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: buildSiteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    { url: buildSiteUrl("/marketplaces"), changeFrequency: "weekly", priority: 0.8 },
    { url: buildSiteUrl("/templates"), changeFrequency: "weekly", priority: 0.8 },
    { url: buildSiteUrl("/tools"), changeFrequency: "weekly", priority: 0.8 },
    { url: buildSiteUrl("/oferta"), changeFrequency: "yearly", priority: 0.3 },
    { url: buildSiteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: buildSiteUrl("/rekvizity"), changeFrequency: "yearly", priority: 0.3 },
    { url: buildSiteUrl("/vozvrat"), changeFrequency: "yearly", priority: 0.3 },
    { url: buildSiteUrl("/consent"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const marketplacePages: MetadataRoute.Sitemap = getAllMarketplaceSlugs().map((slug) => ({
    url: buildSiteUrl(`/marketplaces/${slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const templatePages: MetadataRoute.Sitemap = getAllTemplateSlugs().map((slug) => ({
    url: buildSiteUrl(`/templates/${slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolPages: MetadataRoute.Sitemap = getAllToolSlugs().map((slug) => ({
    url: buildSiteUrl(`/tools/${slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const marketplaceTemplatePages: MetadataRoute.Sitemap = getAllMarketplaceTemplateParams().map(
    ({ marketplaceSlug, templateSlug }) => ({
      url: buildSiteUrl(`/marketplaces/${marketplaceSlug}/templates/${templateSlug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  const marketplaceToolPages: MetadataRoute.Sitemap = getAllMarketplaceToolParams().map(
    ({ marketplaceSlug, toolSlug }) => ({
      url: buildSiteUrl(`/marketplaces/${marketplaceSlug}/tools/${toolSlug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  const apiBlogPosts = await fetchAllApiBlogPosts();
  const apiBlogPathSet = new Set(apiBlogPosts.map((p) => p.canonical_path));

  const apiBlogPages: MetadataRoute.Sitemap = apiBlogPosts.map((post) => ({
    url: buildSiteUrl(post.canonical_path),
    lastModified: post.published_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticBlogPages: MetadataRoute.Sitemap = allBlogPosts
    .filter((post) => !apiBlogPathSet.has(post.canonicalPath))
    .map((post) => ({
      url: buildSiteUrl(post.canonicalPath),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...marketplacePages,
    ...templatePages,
    ...toolPages,
    ...marketplaceTemplatePages,
    ...marketplaceToolPages,
    ...apiBlogPages,
    ...staticBlogPages,
  ];
}
