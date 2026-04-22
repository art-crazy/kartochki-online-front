import type { Metadata } from "next";
import { LegalDocumentPage, refundDocument } from "@/views/legal";
import { buildPageMetadata } from "@/shared/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Возвраты и отмена — kartochki.online",
  description: "Условия отключения автопродления, действия подписки до конца периода и порядок рассмотрения возвратов.",
  path: "/vozvrat",
});

export default function RefundRoute() {
  return <LegalDocumentPage document={refundDocument} />;
}
