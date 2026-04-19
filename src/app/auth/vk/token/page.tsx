import type { Metadata } from "next";
import { Suspense } from "react";
import { buildNoindexMetadata } from "@/shared/seo";
import { VkTokenHandler } from "@/features/auth/ui/VkTokenHandler";

export const metadata: Metadata = buildNoindexMetadata({
  title: "VK token handler",
  description: "Service route for VK authorization completion.",
  path: "/auth/vk/token",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VkTokenHandler />
    </Suspense>
  );
}
