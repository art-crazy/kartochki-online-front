import type { Metadata } from "next";
import { LegalDocumentPage, privacyDocument } from "@/views/legal";
import { buildPageMetadata } from "@/shared/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Политика конфиденциальности — kartochki.online",
  description: "Порядок обработки персональных данных, billing-событий, cookies и обращений пользователей сервиса.",
  path: "/privacy",
});

export default function PrivacyRoute() {
  return <LegalDocumentPage document={privacyDocument} />;
}
