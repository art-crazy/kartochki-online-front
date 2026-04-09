import type { Metadata } from "next";
import { BillingPage } from "@/views/billing/ui/BillingPage";

export const metadata: Metadata = {
  title: "Тарифы и оплата",
  description: "Управление подпиской kartochki.online, лимитами генераций и дополнительными пакетами карточек.",
};

export default function AppBillingRoute() {
  return <BillingPage />;
}
