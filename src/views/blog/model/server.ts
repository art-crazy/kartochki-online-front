import { listPublicBlogPosts } from "@/shared/api";
import { fallbackBlogPageContent, mapBlogListResponse } from "./content";

export async function getBlogPageContent(page: number) {
  try {
    const { data } = await listPublicBlogPosts({
      query: {
        page,
        page_size: 12,
      },
      throwOnError: true,
    });

    return mapBlogListResponse(data);
  } catch {
    return fallbackBlogPageContent;
  }
}

export function getBlogPageNumber(value: string | undefined) {
  const page = Number(value ?? 1);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
