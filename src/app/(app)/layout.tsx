import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { requireCurrentUser } from "@/shared/auth/server";
import { AuthSessionProvider } from "@/shared/auth/ui/AuthSessionProvider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProductLayout({ children }: PropsWithChildren) {
  const user = await requireCurrentUser();

  return <AuthSessionProvider initialUser={user}>{children}</AuthSessionProvider>;
}
