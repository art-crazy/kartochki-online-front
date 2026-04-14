"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGenerateConfigOptions } from "@/shared/api";
import { Button, CardSurface } from "@/shared/ui";
import { mapGenerateConfigResponse } from "@/views/generate/model/mappers";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { GenerateScreen } from "@/widgets/app/generate-screen/ui/GenerateScreen";
import styles from "./GeneratePage.module.scss";

export function GeneratePage() {
  const {
    data: config,
    isError,
    isPending,
    refetch,
  } = useQuery({
    ...getGenerateConfigOptions(),
    select: mapGenerateConfigResponse,
  });

  if (isPending) {
    return (
      <GenerateStateShell subtitle="Загружаем параметры генерации">
        <GenerateStateCard title="Загружаем настройки" description="Получаем площадки, стили, типы карточек и доступные лимиты." />
      </GenerateStateShell>
    );
  }

  if (isError || !config) {
    return (
      <GenerateStateShell subtitle="Не удалось получить параметры генерации">
        <GenerateStateCard
          title="Генерация недоступна"
          description="Проверьте API и повторите запрос."
          action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
        />
      </GenerateStateShell>
    );
  }

  return <GenerateScreen config={config} />;
}

function GenerateStateShell({ children, subtitle }: { children: ReactNode; subtitle: string }) {
  return (
    <AppShell title="Генерация карточек" subtitle={subtitle} activeKey="generate">
      <main className={styles.page}>{children}</main>
    </AppShell>
  );
}

function GenerateStateCard({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.stateCard}>
      <h2 className={styles.stateTitle}>{title}</h2>
      <p className={styles.stateText}>{description}</p>
      {action ? <div className={styles.stateAction}>{action}</div> : null}
    </CardSurface>
  );
}
