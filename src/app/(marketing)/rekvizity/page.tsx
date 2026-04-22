import type { Metadata } from "next";
import { legalFooterColumns, blogHeaderNav } from "@/shared/config/marketing";
import { buildPageMetadata } from "@/shared/seo";
import { rekvizityRows } from "@/views/legal";
import { SiteFooter } from "@/widgets/marketing/site-footer";
import { SiteHeader } from "@/widgets/marketing/site-header";
import styles from "./RekvizityPage.module.scss";

export const metadata: Metadata = buildPageMetadata({
  title: "Реквизиты — карточки.онлайн",
  description: "Реквизиты ИП Аржанников Михаил Алексеевич: ИНН, ОГРНИП.",
  path: "/rekvizity",
});

export default function RekvizityRoute() {
  return (
    <main className={styles.page}>
      <SiteHeader nav={blogHeaderNav} />

      <section className={styles.content}>
        <div className={styles.label}>Юридическая информация</div>
        <h1 className={styles.title}>Реквизиты</h1>

        <div className={styles.card}>
          {rekvizityRows.map(({ label, value }) => (
            <div key={label} className={styles.row}>
              <span className={styles.rowLabel}>{label}</span>
              <span className={styles.rowValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter columns={legalFooterColumns} />
    </main>
  );
}
