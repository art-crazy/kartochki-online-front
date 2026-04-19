import { marketingFooterColumns } from "@/shared/config/marketing";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";

export function HomeFooter() {
  return <SiteFooter columns={marketingFooterColumns} />;
}
