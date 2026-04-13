import { ResetPasswordForm } from "@/features/auth/ui/ResetPasswordForm";
import { AuthLayout } from "./AuthLayout";

type ResetPasswordPageProps = {
  token: string;
};

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
