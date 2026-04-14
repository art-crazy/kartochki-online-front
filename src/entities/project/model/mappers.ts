import type { Project } from "@/shared/api";

export type ProjectListItem = {
  id: string;
  title: string;
  marketplace: string;
  productName: string;
  productDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetailsContent = ProjectListItem & {
  marketplaceLabel: string;
};

export function mapProject(project: Project): ProjectListItem {
  return {
    id: project.id,
    title: project.title,
    marketplace: project.marketplace ?? "wildberries",
    productName: project.product_name ?? "",
    productDescription: project.product_description ?? "",
    createdAt: formatDate(project.created_at),
    updatedAt: formatDate(project.updated_at),
  };
}

export function mapProjects(projects: ReadonlyArray<Project> | undefined): ProjectListItem[] {
  return projects?.map(mapProject) ?? [];
}

export function mapProjectDetails(project: Project): ProjectDetailsContent {
  const mapped = mapProject(project);

  return {
    ...mapped,
    marketplaceLabel: getMarketplaceLabel(mapped.marketplace),
  };
}

export function getMarketplaceLabel(marketplace: string) {
  const normalized = marketplace.trim().toLowerCase().replaceAll("-", "_");

  if (normalized === "wildberries" || normalized === "wb") return "Wildberries";
  if (normalized === "ozon") return "Ozon";
  if (normalized === "ym" || normalized === "yandex" || normalized === "yandex_market") return "Яндекс Маркет";

  return marketplace;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
