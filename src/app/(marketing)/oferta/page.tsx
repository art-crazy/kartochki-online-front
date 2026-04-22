import type { Metadata } from "next";
import { ofertaDocument, LegalDocumentPage } from "@/views/legal";
import { buildPageMetadata } from "@/shared/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Оферта — kartochki.online",
  description: "Публичная оферта на использование сервиса kartochki.online и платной подписки с автопродлением.",
  path: "/oferta",
});

export default function OfertaRoute() {
  return <LegalDocumentPage document={ofertaDocument} />;
}
