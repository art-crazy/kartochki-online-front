import type { MetadataRoute } from "next";
import { buildSiteUrl } from "@/shared/config/site";
import { getIndexableSiteMapLinks } from "@/views/site-map/model/siteMap";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const priorities = new Map<string, number>([
    ["/", 1.0],
    ["/marketplaces", 0.9],
    ["/tools", 0.85],
    ["/templates", 0.8],
    ["/blog", 0.8],
  ]);

  return getIndexableSiteMapLinks().map((link) => ({
    url: buildSiteUrl(link.href),
    lastModified: now,
    changeFrequency: link.href.startsWith("/blog/") ? ("weekly" as const) : ("monthly" as const),
    priority: priorities.get(link.href) ?? 0.7,
  }));
}
