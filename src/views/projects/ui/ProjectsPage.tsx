"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectMutation,
  deleteProjectMutation,
  getDashboardQueryKey,
  listProjectsOptions,
  listProjectsQueryKey,
  patchProjectMutation,
  type ErrorResponse,
} from "@/shared/api";
import { mapProjects, type ProjectListItem } from "@/entities/project";
import { Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { ProjectForm, ProjectRow, ProjectsStatus, type ProjectDraft } from "./ProjectsPageParts";
import styles from "./ProjectsPage.module.scss";

type ToastState = {
  message: string;
  tone: "success" | "danger";
};

const emptyDraft: ProjectDraft = {
  title: "",
  marketplace: "wildberries",
  productName: "",
  productDescription: "",
};

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectListItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectListItem | null>(null);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);

  const { data, isError, isPending, refetch } = useQuery({
    ...listProjectsOptions(),
    select: (response) => mapProjects(response.projects),
  });

  const projects = useMemo(() => data ?? [], [data]);

  const createMutation = useMutation({
    ...createProjectMutation(),
    onSuccess: () => {
      resetForm();
      setCreateFormOpen(false);
      showToast("Проект создан");
      invalidateProjects();
    },
    onError: (error: ErrorResponse) => showToast(error.message ?? "Не удалось создать проект", "danger"),
  });

  const patchMutation = useMutation({
    ...patchProjectMutation(),
    onSuccess: () => {
      resetForm();
      setEditingProject(null);
      showToast("Проект обновлен");
      invalidateProjects();
    },
    onError: (error: ErrorResponse) => showToast(error.message ?? "Не удалось обновить проект", "danger"),
  });

  const deleteMutation = useMutation({
    ...deleteProjectMutation(),
    onSuccess: () => {
      setProjectToDelete(null);
      showToast("Проект удален");
      invalidateProjects();
    },
    onError: (error: ErrorResponse) => showToast(error.message ?? "Не удалось удалить проект", "danger"),
  });

  const projectStats = useMemo(() => {
    const marketplaceCount = new Set(projects.map((project) => project.marketplace)).size;
    return [
      { label: "Всего проектов", value: String(projects.length) },
      { label: "Маркетплейсов", value: String(marketplaceCount) },
    ];
  }, [projects]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, tone: ToastState["tone"] = "success") {
    setToast({ message, tone });
  }

  function invalidateProjects() {
    void queryClient.invalidateQueries({ queryKey: listProjectsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getDashboardQueryKey() });
  }

  function resetForm() {
    setDraft(emptyDraft);
  }

  function startCreate() {
    setEditingProject(null);
    resetForm();
    setCreateFormOpen(true);
  }

  function startEdit(project: ProjectListItem) {
    setCreateFormOpen(false);
    setEditingProject(project);
    setDraft({
      title: project.title,
      marketplace: project.marketplace,
      productName: project.productName,
      productDescription: project.productDescription,
    });
  }

  function closeForm() {
    setCreateFormOpen(false);
    setEditingProject(null);
    resetForm();
  }

  function submitForm() {
    const title = draft.title.trim();

    if (!title) {
      showToast("Введите название проекта", "danger");
      return;
    }

    const body = {
      title,
      marketplace: draft.marketplace,
      product_name: draft.productName.trim() || undefined,
      product_description: draft.productDescription.trim() || undefined,
    };

    if (editingProject) {
      patchMutation.mutate({ path: { id: editingProject.id }, body });
      return;
    }

    createMutation.mutate({ body });
  }

  function deleteProject() {
    if (!projectToDelete) return;
    deleteMutation.mutate({ path: { id: projectToDelete.id } });
  }

  return (
    <AppShell title="Проекты" subtitle="Сохраненные наборы карточек и черновики" activeKey="projects">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.heroTitle}>Проекты</h1>
            <p className={styles.heroText}>Создавайте черновики, обновляйте названия и убирайте лишние проекты.</p>
          </div>
          <Button variant="darkPrimary" onClick={startCreate}>+ Новый проект</Button>
        </section>

        {isPending ? <ProjectsStatus title="Загружаем проекты" description="Получаем список проектов из API." /> : null}

        {isError ? (
          <ProjectsStatus
            title="Проекты не загрузились"
            description="Проверьте подключение к API и повторите запрос."
            action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
          />
        ) : null}

        {!isPending && !isError ? (
          <>
            <section className={styles.statsGrid} aria-label="Сводка по проектам">
              {projectStats.map((stat) => (
                <CardSurface key={stat.label} theme="dark" className={styles.statCard}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <strong className={styles.statValue}>{stat.value}</strong>
                </CardSurface>
              ))}
            </section>

            {createFormOpen || editingProject ? (
              <ProjectForm
                title={editingProject ? "Редактировать проект" : "Новый проект"}
                submitLabel={editingProject ? "Сохранить изменения" : "Создать проект"}
                draft={draft}
                isSubmitting={createMutation.isPending || patchMutation.isPending}
                onDraftChange={setDraft}
                onClose={closeForm}
                onSubmit={submitForm}
              />
            ) : null}

            {projects.length ? (
              <section className={styles.projectList} aria-label="Список проектов">
                {projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    deletePending={deleteMutation.isPending}
                    onEdit={() => startEdit(project)}
                    onDelete={() => setProjectToDelete(project)}
                  />
                ))}
              </section>
            ) : (
              <ProjectsStatus
                title="Проектов пока нет"
                description="Создайте первый проект или начните генерацию карточек."
                action={<Button as={Link} href="/app/generate" variant="darkPrimary">Перейти к генерации</Button>}
              />
            )}
          </>
        ) : null}
      </main>

      {toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={toast.tone === "danger" ? styles.toastDotDanger : styles.toastDotSuccess} />
          <span>{toast.message}</span>
        </div>
      ) : null}

      {projectToDelete ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => !deleteMutation.isPending && setProjectToDelete(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-project-title" onClick={(event) => event.stopPropagation()}>
            <CardSurface theme="dark" className={styles.modal}>
              <h2 id="delete-project-title" className={styles.cardTitle}>Удалить проект?</h2>
              <p className={styles.statusText}>Проект «{projectToDelete.title}» исчезнет из списка.</p>
              <div className={styles.modalActions}>
                <Button variant="darkOutline" disabled={deleteMutation.isPending} onClick={() => setProjectToDelete(null)}>Отмена</Button>
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
