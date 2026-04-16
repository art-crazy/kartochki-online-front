import type { GeneratedCard, Project } from "@/shared/api";

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
  cards: ReadonlyArray<ProjectCardItem>;
};

export type ProjectCardItem = {
  id: string;
  label: string;
  previewUrl: string;
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
    cards: mapProjectCards(project.cards),
    marketplaceLabel: getMarketplaceLabel(mapped.marketplace),
  };
}

export function mapProjectCards(cards: ReadonlyArray<GeneratedCard> | undefined): ProjectCardItem[] {
  return cards?.map(mapProjectCard) ?? [];
}

export function mapProjectCard(card: GeneratedCard): ProjectCardItem {
  return {
    id: card.id,
    label: getProjectCardLabel(card.card_type_id),
    previewUrl: card.preview_url,
  };
}

export function getMarketplaceLabel(marketplace: string) {
  const normalized = marketplace.trim().toLowerCase().replaceAll("-", "_");

  if (normalized === "wildberries" || normalized === "wb") return "Wildberries";
  if (normalized === "ozon") return "Ozon";
  if (normalized === "ym" || normalized === "yandex" || normalized === "yandex_market") {
    return "\u042f\u043d\u0434\u0435\u043a\u0441 \u041c\u0430\u0440\u043a\u0435\u0442";
  }

  return marketplace;
}

export function getProjectCardLabel(cardTypeId: string) {
  const normalized = cardTypeId.trim().toLowerCase().replaceAll("-", "_");

  if (normalized === "main") return "\u0413\u043b\u0430\u0432\u043d\u0430\u044f";
  if (normalized === "infographic") return "\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430";
  if (normalized === "composition" || normalized === "ingredients") return "\u0421\u043e\u0441\u0442\u0430\u0432";
  if (normalized === "dimensions" || normalized === "sizes") return "\u0420\u0430\u0437\u043c\u0435\u0440\u044b";
  if (normalized === "details") return "\u0414\u0435\u0442\u0430\u043b\u0438";
  if (normalized === "advantages" || normalized === "benefits") return "\u041f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430";

  return cardTypeId
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
