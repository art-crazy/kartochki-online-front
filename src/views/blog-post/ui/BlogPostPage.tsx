import { articleSchema, faqSchema } from "@/entities/blog/model/structuredData";
import { blogPost } from "@/entities/blog/model/content";
import { buildDetailBreadcrumbs } from "@/shared/seo";
import { SeoJsonLd } from "@/shared/ui";
import { BlogPost } from "@/widgets/marketing/blog-post/ui/BlogPost";
import { BlogPostPageShell } from "./BlogPostPageShell";

export function BlogPostPage() {
  const breadcrumbs = buildDetailBreadcrumbs("Блог", "/blog", blogPost.title);

  return (
    <>
      <SeoJsonLd data={articleSchema} />
      <SeoJsonLd data={faqSchema} />
      <BlogPostPageShell breadcrumbs={breadcrumbs} currentPath={blogPost.canonicalPath}>
        <BlogPost />
      </BlogPostPageShell>
    </>
  );
}
