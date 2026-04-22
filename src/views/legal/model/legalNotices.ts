import { siteConfig } from "@/shared/config/site";
import type { RekvizityRow } from "./types";

export const rekvizityRows: readonly RekvizityRow[] = [
  { label: "Организация", value: "Индивидуальный предприниматель Аржанников Михаил Алексеевич" },
  { label: "ИНН", value: "420544415156" },
  { label: "ОГРНИП", value: "324420500063173" },
  { label: "Сайт", value: siteConfig.domains[0] },
  { label: "Адрес электронной почты", value: siteConfig.supportEmail },
] as const;
