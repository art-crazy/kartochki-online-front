import type { BlogPostResponse } from "@/shared/api";
import { blogHeaderLinks, legalFooterLinks } from "@/shared/config/marketing";
import { ApiBlogPost } from "@/widgets/marketing/blog-post/ui/ApiBlogPost";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";

type ApiBlogPostPageProps = {
  content: BlogPostResponse;
};

export function ApiBlogPostPage({ content }: ApiBlogPostPageProps) {
  return (
    <>
      <SiteHeader links={blogHeaderLinks} />
      <ApiBlogPost content={content} />
      <SiteFooter links={legalFooterLinks} />
    </>
  );
}
