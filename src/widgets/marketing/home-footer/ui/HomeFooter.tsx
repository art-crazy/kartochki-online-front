import { marketingFooterLinks } from "@/shared/config/marketing";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";

export function HomeFooter() {
  return <SiteFooter links={marketingFooterLinks} />;
}
