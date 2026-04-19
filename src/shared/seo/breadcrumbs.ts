export type SeoBreadcrumbItem = {
  label: string;
  href?: string;
};

const HOME_BREADCRUMB: SeoBreadcrumbItem = {
  label: "Главная",
  href: "/",
};

export function buildHubBreadcrumbs(sectionLabel: string): SeoBreadcrumbItem[] {
  return [HOME_BREADCRUMB, { label: sectionLabel }];
}

export function buildDetailBreadcrumbs(
  sectionLabel: string,
  sectionHref: string,
  currentLabel: string,
): SeoBreadcrumbItem[] {
  return [HOME_BREADCRUMB, { label: sectionLabel, href: sectionHref }, { label: currentLabel }];
}
