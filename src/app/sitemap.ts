import type { MetadataRoute } from "next";
import { buildSiteUrl } from "@/shared/config/site";
import { getAllMarketplaceSlugs } from "@/views/marketplace-landing/model/marketplaces";
import { getAllToolSlugs } from "@/views/tool-landing/model/tools";
import { getAllTemplateSlugs } from "@/views/template-landing/model/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildSiteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: buildSiteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: buildSiteUrl("/marketplaces"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildSiteUrl("/tools"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: buildSiteUrl("/templates"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const marketplaceRoutes: MetadataRoute.Sitemap = getAllMarketplaceSlugs().map((slug) => ({
    url: buildSiteUrl(`/marketplaces/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const toolRoutes: MetadataRoute.Sitemap = getAllToolSlugs().map((slug) => ({
    url: buildSiteUrl(`/tools/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const templateRoutes: MetadataRoute.Sitemap = getAllTemplateSlugs().map((slug) => ({
    url: buildSiteUrl(`/templates/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...marketplaceRoutes, ...toolRoutes, ...templateRoutes];
}
