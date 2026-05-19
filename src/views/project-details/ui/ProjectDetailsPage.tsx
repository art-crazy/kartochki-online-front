"use client";

import Image from "next/image";
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
import { downloadFileFromUrl } from "@/shared/lib/downloadFile";
import { Badge, Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./ProjectDetailsPage.module.scss";

export function ProjectDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

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

  const selectedCard = data?.cards.find((card) => card.id === selectedCardId) ?? data?.cards[0];

  function handleSelectCard(cardId: string) {
    setDownloadError("");
    setSelectedCardId(cardId);
  }

  async function downloadSelectedCard() {
    if (!data || !selectedCard) {
      return;
    }

    setDownloadError("");
    setIsDownloadingCard(true);

    try {
      await downloadFileFromUrl(selectedCard.previewUrl, {
        defaultExtension: "png",
        filename: `${data.title}-${selectedCard.label}`,
      });
    } catch {
      setDownloadError("Не удалось скачать изображение");
    } finally {
      setIsDownloadingCard(false);
    }
  }

  return (
    <AppShell
      title="Проект"
      subtitle="Данные проекта и готовые карточки"
      activeKey="projects"
    >
      <main className={styles.page}>
        {isPending ? (
          <StateCard
            title="Загружаем проект"
            description="Получаем данные проекта и его карточки из API."
          />
        ) : null}

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

            <section className={styles.gallerySection}>
              <div className={styles.galleryHeader}>
                <div>
                  <h2>Карточки проекта</h2>
                  <p>
                    {data.cards.length
                      ? `${formatReadyWord(data.cards.length)} ${data.cards.length} ${formatCardCount(data.cards.length)}.`
                      : "В этом проекте пока нет сгенерированных карточек."}
                  </p>
                </div>
                {selectedCard ? (
                  <Button
                    variant="darkOutline"
                    size="sm"
                    loading={isDownloadingCard}
                    onClick={() => void downloadSelectedCard()}
                  >
                    Скачать изображение
                  </Button>
                ) : null}
              </div>

              {selectedCard ? (
                <div className={styles.galleryLayout}>
                  <div className={styles.featuredCard}>
                    <div className={styles.featuredImageWrap}>
                      <Image
                        src={selectedCard.previewUrl}
                        alt={selectedCard.label}
                        fill
                        sizes="(max-width: 960px) 100vw, 720px"
                        unoptimized
                        className={styles.featuredImage}
                      />
                    </div>
                    <div className={styles.featuredMeta}>
                      <strong>{selectedCard.label}</strong>
                      <span>Карточка проекта</span>
                    </div>
                  </div>

                  <div className={styles.thumbGrid}>
                    {data.cards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        className={[styles.thumbButton, card.id === selectedCard.id ? styles.thumbButtonActive : ""].join(" ")}
                        onClick={() => handleSelectCard(card.id)}
                      >
                        <span className={styles.thumbImageWrap}>
                          <Image src={card.previewUrl} alt={card.label} fill sizes="160px" unoptimized className={styles.thumbImage} />
                        </span>
                        <span className={styles.thumbLabel}>{card.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.emptyGallery}>
                  <div className={styles.emptyGalleryVisual} aria-hidden="true" />
                  <div>
                    <strong>Превью пока нет</strong>
                    <p>Когда карточки появятся, они будут показаны здесь.</p>
                  </div>
                </div>
              )}
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

            {downloadError ? <p className={styles.error}>{downloadError}</p> : null}
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

function formatReadyWord(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "Готова";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "Готовы";
  return "Готово";
}

function formatCardCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "карточка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "карточки";
  return "карточек";
}
