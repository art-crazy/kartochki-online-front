import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AuthSessionProvider } from "@/shared/auth/ui/AuthSessionProvider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductLayout({ children }: PropsWithChildren) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
