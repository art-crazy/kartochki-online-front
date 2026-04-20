import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata, MARKETING_PAGE_REVALIDATE } from "@/shared/seo";
import {
  getMarketplacePage,
  getAllMarketplaceSlugs,
} from "@/views/marketplace-landing/model/marketplaces";
import { MarketplaceLandingPage } from "@/views/marketplace-landing/ui/MarketplacePage";

type MarketplaceRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = MARKETING_PAGE_REVALIDATE;

export function generateStaticParams() {
  return getAllMarketplaceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MarketplaceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getMarketplacePage(slug);

  if (!content) return {};

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: `/marketplaces/${slug}`,
    openGraphTitle: content.openGraphTitle,
    openGraphDescription: content.openGraphDescription,
  });
}

export default async function MarketplaceRoute({ params }: MarketplaceRouteProps) {
  const { slug } = await params;
  const content = getMarketplacePage(slug);

  if (!content) notFound();

  return <MarketplaceLandingPage content={content} />;
}
