import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/shared/seo";
import { getToolPage, getAllToolSlugs } from "@/views/tool-landing/model/tools";
import { ToolLandingPage } from "@/views/tool-landing/ui/ToolPage";

type ToolRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 86_400;

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getToolPage(slug);

  if (!content) return {};

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: `/tools/${slug}`,
    openGraphTitle: content.openGraphTitle,
    openGraphDescription: content.openGraphDescription,
  });
}

export default async function ToolRoute({ params }: ToolRouteProps) {
  const { slug } = await params;
  const content = getToolPage(slug);

  if (!content) notFound();

  return <ToolLandingPage content={content} />;
}
