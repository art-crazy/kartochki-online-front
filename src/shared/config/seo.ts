import { buildSiteUrl } from "./site";

export const MARKETING_PAGE_REVALIDATE = 86_400;

export const seoPublisher = {
  "@type": "Organization" as const,
  name: "kartochki.online",
  url: buildSiteUrl("/"),
  logo: {
    "@type": "ImageObject" as const,
    url: buildSiteUrl("/logo.png"),
  },
};

export const seoBlogImageUrl = buildSiteUrl("/og-blog.png");
