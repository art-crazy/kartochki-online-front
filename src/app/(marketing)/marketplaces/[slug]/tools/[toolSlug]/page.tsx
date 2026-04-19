import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/shared/seo";
import {
  getAllMarketplaceToolParams,
  getMarketplaceToolLanding,
  buildMarketplaceToolHref,
} from "@/views/marketplace-tool-landing/model/solutions";
import { MarketplaceToolPage } from "@/views/marketplace-tool-landing/ui/MarketplaceToolPage";

type MarketplaceToolRouteProps = {
  params: Promise<{
    slug: string;
    toolSlug: string;
  }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllMarketplaceToolParams().map(({ marketplaceSlug, toolSlug }) => ({
    slug: marketplaceSlug,
    toolSlug,
  }));
}

export async function generateMetadata({ params }: MarketplaceToolRouteProps): Promise<Metadata> {
  const { slug, toolSlug } = await params;
  const marketplaceSlug = slug;
  const content = getMarketplaceToolLanding(marketplaceSlug, toolSlug);

  if (!content) {
    return {};
  }

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: buildMarketplaceToolHref(marketplaceSlug, toolSlug),
    openGraphTitle: content.openGraphTitle,
    openGraphDescription: content.openGraphDescription,
  });
}

export default async function MarketplaceToolRoute({ params }: MarketplaceToolRouteProps) {
  const { slug, toolSlug } = await params;
  const marketplaceSlug = slug;
  const content = getMarketplaceToolLanding(marketplaceSlug, toolSlug);

  if (!content) {
    notFound();
  }

  return <MarketplaceToolPage content={content} />;
}
