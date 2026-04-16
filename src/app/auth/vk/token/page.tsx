import { Suspense } from "react";
import { VkTokenHandler } from "@/features/auth/ui/VkTokenHandler";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VkTokenHandler />
    </Suspense>
  );
}
