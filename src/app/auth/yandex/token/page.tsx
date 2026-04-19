import type { Metadata } from "next";
import { buildNoindexMetadata } from "@/shared/seo";
import { YandexTokenPage } from "@/views/auth/ui/YandexTokenPage";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Yandex token handler",
  description: "Service route for Yandex authorization completion.",
  path: "/auth/yandex/token",
});

export default function Page() {
  return <YandexTokenPage />;
}
