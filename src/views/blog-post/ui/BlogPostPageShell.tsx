import type { ReactNode } from "react";
import { blogHeaderLinks, legalFooterLinks } from "@/shared/config/marketing";
import type { SeoBreadcrumbItem } from "@/shared/ui";
import { SeoBreadcrumbs } from "@/shared/ui";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";

type BlogPostPageShellProps = {
  children: ReactNode;
  breadcrumbs?: ReadonlyArray<SeoBreadcrumbItem>;
  currentPath?: string;
};

export function BlogPostPageShell({ children, breadcrumbs, currentPath }: BlogPostPageShellProps) {
  return (
    <>
      <SiteHeader links={blogHeaderLinks} />
      {breadcrumbs ? <SeoBreadcrumbs items={breadcrumbs} currentPath={currentPath} compact /> : null}
      {children}
      <SiteFooter links={legalFooterLinks} />
    </>
  );
}
