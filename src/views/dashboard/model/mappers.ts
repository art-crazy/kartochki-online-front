import type { DashboardProject as ApiDashboardProject, DashboardResponse, DashboardStat as ApiDashboardStat } from "@/shared/api";
import type { DashboardPageContent, DashboardProject, DashboardStat, DashboardStatVariant } from "./content";

export function mapDashboardResponse(response: DashboardResponse): DashboardPageContent {
  return {
    stats: response.stats.map(mapStat),
    recentProjects: response.recent_projects.map(mapProject),
    allProjects: response.all_projects.map(mapProject),
    quickStart: {
      title: response.quick_start.title,
      description: response.quick_start.description,
      href: response.quick_start.canonical_path,
    },
  };
}

function mapStat(stat: ApiDashboardStat): DashboardStat {
  const variant = getStatVariant(stat);
  return {
    label: stat.label,
    value: stat.value,
    valueParts: variant === "usage" ? splitUsageValue(stat.value) : undefined,
    description: stat.description,
    accentText: stat.accent_text,
    variant,
    progress:
      stat.progress?.value !== undefined && stat.progress.max !== undefined
        ? { value: stat.progress.value, max: stat.progress.max }
        : undefined,
  };
}

function mapProject(project: ApiDashboardProject): DashboardProject {
  return {
    id: project.id,
    title: project.title,
    cardCount: project.card_count ?? 0,
    marketplace: project.marketplace_id ?? "wildberries",
    updatedAt: formatUpdatedAt(project.updated_at),
    previewUrls: project.preview_urls,
    href: project.canonical_path,
  };
}

function getStatVariant(stat: ApiDashboardStat): DashboardStatVariant {
  const key = stat.key.toLowerCase();
  if (stat.progress || key.includes("usage") || key.includes("card")) return "usage";
  if (key.includes("tariff") || key.includes("plan") || key.includes("subscription")) return "tariff";
  return "default";
}

function splitUsageValue(value: string) {
  const [primary, ...rest] = value.split("/");
  if (!primary || rest.length === 0) return undefined;
  return { primary: primary.trim(), secondary: `/ ${rest.join("/").trim()}` };
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
