import type { Metadata } from "next";
import { buildNoindexMetadata } from "@/shared/seo";
import { UIKitPage } from "@/views/ui-kit/ui/UIKitPage";

export const metadata: Metadata = buildNoindexMetadata({
  title: "UI Components",
  description: "Internal UI components showcase.",
  path: "/components",
});

export default function ComponentsRoute() {
  return <UIKitPage />;
}
