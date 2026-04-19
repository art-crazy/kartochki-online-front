import type { BlogPostResponse } from "@/shared/api";
import { buildDetailBreadcrumbs } from "@/shared/seo";
import { ApiBlogPost } from "@/widgets/marketing/blog-post/ui/ApiBlogPost";
import { BlogPostPageShell } from "./BlogPostPageShell";

type ApiBlogPostPageProps = {
  content: BlogPostResponse;
};

export function ApiBlogPostPage({ content }: ApiBlogPostPageProps) {
  const breadcrumbs = buildDetailBreadcrumbs("Блог", "/blog", content.post.title);

  return (
    <BlogPostPageShell breadcrumbs={breadcrumbs} currentPath={content.post.canonical_path}>
      <ApiBlogPost content={content} />
    </BlogPostPageShell>
  );
}
