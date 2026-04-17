import { articleSchema, faqSchema } from "@/entities/blog/model/content";
import { blogPost, breadcrumbItems } from "@/entities/blog/model/content";
import { BlogPost } from "@/widgets/marketing/blog-post/ui/BlogPost";
import { BlogPostPageShell } from "./BlogPostPageShell";

export function BlogPostPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BlogPostPageShell breadcrumbs={breadcrumbItems} currentPath={blogPost.canonicalPath}>
        <BlogPost />
      </BlogPostPageShell>
    </>
  );
}
