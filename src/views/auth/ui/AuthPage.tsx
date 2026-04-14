import { Suspense } from "react";
import { AuthFlow } from "@/features/auth/ui/AuthFlow";
import { AuthLayout } from "./AuthLayout";

export function AuthPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <AuthFlow />
      </Suspense>
    </AuthLayout>
  );
}
