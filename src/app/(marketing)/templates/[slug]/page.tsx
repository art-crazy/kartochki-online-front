import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/shared/seo";
import { getTemplatePage, getAllTemplateSlugs } from "@/views/template-landing/model/templates";
import { TemplateLandingPage } from "@/views/template-landing/ui/TemplatePage";

type TemplateRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TemplateRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getTemplatePage(slug);

  if (!content) return {};

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    path: `/templates/${slug}`,
    openGraphTitle: content.openGraphTitle,
    openGraphDescription: content.openGraphDescription,
  });
}

export default async function TemplateRoute({ params }: TemplateRouteProps) {
  const { slug } = await params;
  const content = getTemplatePage(slug);

  if (!content) notFound();

  return <TemplateLandingPage content={content} />;
}
