import type { Metadata } from "next";
import { legalFooterLinks, blogHeaderLinks } from "@/shared/config/marketing";
import { siteConfig } from "@/shared/config/site";
import { buildNoindexMetadata } from "@/shared/seo";
import { SiteFooter } from "@/widgets/marketing/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/marketing/site-header/ui/SiteHeader";
import styles from "./RekvizityPage.module.scss";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Реквизиты — карточки.онлайн",
  description: "Реквизиты ИП Аржанников Михаил Алексеевич: ИНН, ОГРНИП.",
  path: "/rekvizity",
});

const rows = [
  { label: "Организация", value: "Индивидуальный предприниматель Аржанников Михаил Алексеевич" },
  { label: "ИНН", value: "420544415156" },
  { label: "ОГРНИП", value: "324420500063173" },
  { label: "Сайт", value: siteConfig.domains[0] },
  { label: "Email", value: siteConfig.supportEmail },
] as const;

export default function RekvizityPage() {
  return (
    <main className={styles.page}>
      <SiteHeader links={blogHeaderLinks} />

      <section className={styles.content}>
        <div className={styles.label}>Юридическая информация</div>
        <h1 className={styles.title}>Реквизиты</h1>

        <div className={styles.card}>
          {rows.map(({ label, value }) => (
            <div key={label} className={styles.row}>
              <span className={styles.rowLabel}>{label}</span>
              <span className={styles.rowValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter links={legalFooterLinks} />
    </main>
  );
}
