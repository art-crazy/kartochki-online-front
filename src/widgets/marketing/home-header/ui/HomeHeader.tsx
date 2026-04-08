import { marketingHeaderLinks } from "@/shared/config/marketing";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";

export function HomeHeader() {
  return <SiteHeader links={marketingHeaderLinks} />;
}
