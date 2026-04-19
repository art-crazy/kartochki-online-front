import type { Metadata } from "next";
import { SettingsPage } from "@/views/settings/ui/SettingsPage";

export const metadata: Metadata = {
  title: "Настройки аккаунта",
  description: "Управление профилем, безопасностью и уведомлениями аккаунта kartochki.online.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
