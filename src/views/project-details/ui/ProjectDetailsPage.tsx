"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapProjectDetails } from "@/entities/project";
import {
  deleteProjectMutation,
  getDashboardQueryKey,
  getProjectByIdOptions,
  listProjectsQueryKey,
  type ErrorResponse,
} from "@/shared/api";
import { Badge, Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./ProjectDetailsPage.module.scss";

export function ProjectDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isError, isPending, refetch } = useQuery({
    ...getProjectByIdOptions({ path: { id } }),
    enabled: Boolean(id),
    select: (response) => mapProjectDetails(response.project),
  });

  const deleteMutation = useMutation({
    ...deleteProjectMutation(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listProjectsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getDashboardQueryKey() });
      router.push("/app/projects");
    },
  });

  function deleteProject() {
    if (!data) return;
    deleteMutation.mutate({ path: { id: data.id } });
  }

  return (
    <AppShell title="Проект" subtitle="Данные проекта из API" activeKey="projects">
      <main className={styles.page}>
        {isPending ? <StateCard title="Загружаем проект" description="Получаем данные проекта из API." /> : null}

        {isError ? (
          <StateCard
            title="Проект не загрузился"
            description="Проверьте доступ к проекту и повторите запрос."
            action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
          />
        ) : null}

        {data ? (
          <CardSurface theme="dark" className={styles.card}>
            <div className={styles.header}>
              <div>
                <Button as={Link} href="/app/projects" variant="darkOutline" size="sm">Назад</Button>
                <h1 className={styles.title}>{data.title}</h1>
              </div>
              <Badge tone="dark">{data.marketplaceLabel}</Badge>
            </div>

            <dl className={styles.metaGrid}>
              <div><dt>Товар</dt><dd>{data.productName || "Не указан"}</dd></div>
              <div><dt>Создан</dt><dd>{data.createdAt}</dd></div>
              <div><dt>Обновлен</dt><dd>{data.updatedAt}</dd></div>
            </dl>

            <section className={styles.description}>
              <h2>Описание</h2>
              <p>{data.productDescription || "Описание товара пока не заполнено."}</p>
            </section>

            <div className={styles.actions}>
              <Button as={Link} href="/app/projects" variant="darkOutline">К списку проектов</Button>
              <Button
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteModalOpen(true)}
              >
                Удалить проект
              </Button>
            </div>

            {deleteMutation.error ? <p className={styles.error}>{getErrorMessage(deleteMutation.error)}</p> : null}
          </CardSurface>
        ) : null}
      </main>

      {deleteModalOpen && data ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => !deleteMutation.isPending && setDeleteModalOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-project-title" onClick={(event) => event.stopPropagation()}>
            <CardSurface theme="dark" className={styles.modal}>
              <h2 id="delete-project-title" className={styles.title}>Удалить проект?</h2>
              <p className={styles.copy}>Проект «{data.title}» исчезнет из списка.</p>
              <div className={styles.actions}>
                <Button variant="darkOutline" disabled={deleteMutation.isPending} onClick={() => setDeleteModalOpen(false)}>Отмена</Button>
                <Button variant="danger" disabled={deleteMutation.isPending} onClick={deleteProject}>
                  {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
                </Button>
              </div>
            </CardSurface>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function StateCard({ action, description, title }: { action?: React.ReactNode; description: string; title: string }) {
  return (
    <CardSurface theme="dark" className={styles.card}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.copy}>{description}</p>
      {action ? <div className={styles.actions}>{action}</div> : null}
    </CardSurface>
  );
}

function getErrorMessage(error: ErrorResponse) {
  return error.message ?? "Не удалось удалить проект";
}
