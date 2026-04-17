import type { BlogPostResponse } from "@/shared/api";
import type { SeoBreadcrumbItem } from "@/shared/ui";
import { ApiBlogPost } from "@/widgets/marketing/blog-post/ui/ApiBlogPost";
import { BlogPostPageShell } from "./BlogPostPageShell";

type ApiBlogPostPageProps = {
  content: BlogPostResponse;
};

export function ApiBlogPostPage({ content }: ApiBlogPostPageProps) {
  const breadcrumbs: ReadonlyArray<SeoBreadcrumbItem> = [
    { label: "Главная", href: "/" },
    { label: "Блог", href: "/blog" },
    { label: content.post.title },
  ];

  return (
    <BlogPostPageShell breadcrumbs={breadcrumbs} currentPath={content.post.canonical_path}>
      <ApiBlogPost content={content} />
    </BlogPostPageShell>
  );
}
