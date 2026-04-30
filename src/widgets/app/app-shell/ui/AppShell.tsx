import type { ReactNode } from "react";
import { AppShellClient } from "./AppShellClient";

type AppShellProps = {
  title: string;
  subtitle: string;
  activeKey: string;
  sidebarPlan?: {
    actionLabel: string;
    href: string;
    label: string;
    progress?: number;
    usage?: string;
  } | null;
  action?: ReactNode;
  children: ReactNode;
};

export function AppShell(props: AppShellProps) {
  return <AppShellClient {...props} />;
}
