import { buildSiteUrl } from "@/shared/config/site";

type ItemListEntry = {
  href: string;
  label: string;
};

export function buildItemListSchema(name: string, items: readonly ItemListEntry[]) {
  const uniqueItems = Array.from(new Map(items.map((item) => [item.href, item])).values());

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: uniqueItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: buildSiteUrl(item.href),
    })),
  };
}
