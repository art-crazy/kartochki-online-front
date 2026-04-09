import type { ReactNode } from "react";
import { AppShellClient } from "./AppShellClient";

type AppShellProps = {
  title: string;
  subtitle: string;
  activeKey: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AppShell(props: AppShellProps) {
  return <AppShellClient {...props} />;
}
