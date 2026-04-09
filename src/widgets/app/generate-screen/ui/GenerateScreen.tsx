"use client";

import { useState } from "react";
import { GenerateWorkspace } from "@/features/generation/ui/GenerateWorkspace";
import { Button } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";

export function GenerateScreen() {
  const [resetVersion, setResetVersion] = useState(0);

  return (
    <AppShell
      title="Генерация карточек"
      subtitle="Загрузи фото — получи готовый сет"
      activeKey="generate"
      action={
        <Button variant="darkOutline" size="md" onClick={() => setResetVersion((current) => current + 1)}>
          ↺ Сбросить
        </Button>
      }
    >
      <GenerateWorkspace key={resetVersion} />
    </AppShell>
  );
}
