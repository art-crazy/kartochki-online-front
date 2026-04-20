import { marketingHeaderNav } from "@/shared/config/marketing";
import { SiteHeader } from "@/widgets/marketing/site-header";

export function HomeHeader() {
  return <SiteHeader nav={marketingHeaderNav} />;
}
