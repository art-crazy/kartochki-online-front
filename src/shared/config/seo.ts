import { siteConfig } from "./site";

export const seoPublisher = {
  "@type": "Organization" as const,
  name: "kartochki.online",
  url: siteConfig.defaultUrl,
  logo: {
    "@type": "ImageObject" as const,
    url: `${siteConfig.defaultUrl}/logo.png`,
  },
};

export const seoBlogImageUrl = `${siteConfig.defaultUrl}/og-blog.png`;
