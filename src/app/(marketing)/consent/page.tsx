import type { Metadata } from "next";
import { consentDocument, LegalDocumentPage } from "@/views/legal";
import { buildPageMetadata } from "@/shared/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Согласие на обработку ПДн — kartochki.online",
  description: "Публичный текст согласия на обработку персональных данных для регистрации, оплаты и использования сервиса.",
  path: "/consent",
});

export default function ConsentRoute() {
  return <LegalDocumentPage document={consentDocument} />;
}
