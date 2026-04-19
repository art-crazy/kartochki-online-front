import { allBlogPosts, getBlogPostBySlug } from "@/entities/blog/model/content";
import { buildMarkdownArticleSchema } from "@/entities/blog/model/structuredData";
import { buildCanonicalUrl, buildDetailBreadcrumbs } from "@/shared/seo";
import { getBlogPostCommercialLinkGroups } from "@/shared/seo/internal-linking";
import { SeoJsonLd } from "@/shared/ui";
import { MarkdownBlogPost } from "./MarkdownBlogPost";
import { BlogPostPageShell } from "./BlogPostPageShell";

type BlogPostPageProps = {
  slug: string;
};

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return null;
  }

  const relatedPosts = allBlogPosts.filter((item) => item.slug !== slug).slice(0, 4);
  const popularPosts = allBlogPosts.slice(0, 4);
  const canonicalUrl = buildCanonicalUrl(post.canonicalPath);
  const commercialLinkGroups = getBlogPostCommercialLinkGroups(post.canonicalPath);
  const breadcrumbs = buildDetailBreadcrumbs("Блог", "/blog", post.title);
  const articleSchema = buildMarkdownArticleSchema(post);

  return (
    <>
      <SeoJsonLd data={articleSchema} />
      <BlogPostPageShell breadcrumbs={breadcrumbs} currentPath={post.canonicalPath}>
        <MarkdownBlogPost
          post={post}
          canonicalUrl={canonicalUrl}
          commercialLinkGroups={commercialLinkGroups}
          relatedPosts={relatedPosts}
          popularPosts={popularPosts}
        />
      </BlogPostPageShell>
    </>
  );
}
