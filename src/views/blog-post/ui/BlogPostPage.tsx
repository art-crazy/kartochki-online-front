import { articleSchema, faqSchema } from "@/entities/blog/model/content";
import { BlogPost } from "@/widgets/marketing/blog-post/ui/BlogPost";

export function BlogPostPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BlogPost />
    </>
  );
}
