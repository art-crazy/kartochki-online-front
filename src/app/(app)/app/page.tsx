import type { Metadata } from "next";
import { DashboardPage } from "@/views/dashboard/ui/DashboardPage";

export const metadata: Metadata = {
  title: "Дашборд",
  description: "Личный кабинет kartochki.online с проектами, лимитами и быстрым доступом к генерации карточек.",
};

export default function AppDashboardRoute() {
  return <DashboardPage />;
}
