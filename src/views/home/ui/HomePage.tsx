import { HomeFooter } from "@/widgets/marketing/home-footer/ui/HomeFooter";
import { HomeHeader } from "@/widgets/marketing/home-header/ui/HomeHeader";
import { HomeHero } from "@/widgets/marketing/home-hero/ui/HomeHero";
import { faqSchema, softwareSchema } from "../model/structuredData";
import { HomeSections } from "@/widgets/marketing/home-sections/ui/HomeSections";
import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeHeader />
      <HomeHero />
      <HomeSections />
      <HomeFooter />
    </main>
  );
}
