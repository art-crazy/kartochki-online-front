import { AuthFlow } from "@/features/auth/ui/AuthFlow";
import { AuthLayout } from "./AuthLayout";

export function AuthPage() {
  return (
    <AuthLayout>
      <AuthFlow />
    </AuthLayout>
  );
}
