import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/shared/seo";
import {
  buildMarketplaceTemplateHref,
  getAllMarketplaceTemplateParams,
  getMarketplaceTemplateLanding,
} from "@/views/marketplace-template-landing/model/solutions";
import { MarketplaceTemplatePage } from "@/views/marketplace-template-landing/ui/MarketplaceTemplatePage";

type MarketplaceTemplateRouteProps = {
  params: Promise<{
    slug: string;
    templateSlug: string;
  }>;
};

export const revalidate = 86_400;

export function generateStaticParams() {
  return getAllMarketplaceTemplateParams().map(({ marketplaceSlug, templateSlug }) => ({
    slug: marketplaceSlug,
    templateSlug,
  }));
}

export async function generateMetadata({ params }: MarketplaceTemplateRouteProps): Promise<Metadata> {
  const { slug, templateSlug } = await params;
  const marketplaceSlug = slug;
  const content = getMarketplaceTemplateLanding(marketplaceSlug, templateSlug);

  if (!content) {
    return {};
  }

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: buildMarketplaceTemplateHref(marketplaceSlug, templateSlug),
    openGraphTitle: content.openGraphTitle,
    openGraphDescription: content.openGraphDescription,
  });
}

export default async function MarketplaceTemplateRoute({ params }: MarketplaceTemplateRouteProps) {
  const { slug, templateSlug } = await params;
  const marketplaceSlug = slug;
  const content = getMarketplaceTemplateLanding(marketplaceSlug, templateSlug);

  if (!content) {
    notFound();
  }

  return <MarketplaceTemplatePage content={content} />;
}
