import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AuthSessionProvider } from "@/shared/auth/ui/AuthSessionProvider";
import { buildNoindexRobots } from "@/shared/seo";

export const metadata: Metadata = {
  robots: buildNoindexRobots(),
};

export default function ProductLayout({ children }: PropsWithChildren) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
