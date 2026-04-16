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
import { Badge, Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./ProjectDetailsPage.module.scss";

export function ProjectDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  return (
    <AppShell
      title={"\u041f\u0440\u043e\u0435\u043a\u0442"}
      subtitle={"\u0414\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0438 \u0433\u043e\u0442\u043e\u0432\u044b\u0435 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438"}
      activeKey="projects"
    >
      <main className={styles.page}>
        {isPending ? (
          <StateCard
            title={"\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0440\u043e\u0435\u043a\u0442"}
            description={"\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u043c \u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0438 \u0435\u0433\u043e \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u0438\u0437 API."}
          />
        ) : null}

        {isError ? (
          <StateCard
            title={"\u041f\u0440\u043e\u0435\u043a\u0442 \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043b\u0441\u044f"}
            description={"\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u043f\u0440\u043e\u0435\u043a\u0442\u0443 \u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u0437\u0430\u043f\u0440\u043e\u0441."}
            action={<Button variant="darkPrimary" onClick={() => void refetch()}>{ "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c" }</Button>}
          />
        ) : null}

        {data ? (
          <CardSurface theme="dark" className={styles.card}>
            <div className={styles.header}>
              <div>
                <Button as={Link} href="/app/projects" variant="darkOutline" size="sm">{ "\u041d\u0430\u0437\u0430\u0434" }</Button>
                <h1 className={styles.title}>{data.title}</h1>
              </div>
              <Badge tone="dark">{data.marketplaceLabel}</Badge>
            </div>

            <dl className={styles.metaGrid}>
              <div><dt>{ "\u0422\u043e\u0432\u0430\u0440" }</dt><dd>{data.productName || "\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d"}</dd></div>
              <div><dt>{ "\u0421\u043e\u0437\u0434\u0430\u043d" }</dt><dd>{data.createdAt}</dd></div>
              <div><dt>{ "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d" }</dt><dd>{data.updatedAt}</dd></div>
            </dl>

            <section className={styles.description}>
              <h2>{ "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435" }</h2>
              <p>{data.productDescription || "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430 \u043f\u043e\u043a\u0430 \u043d\u0435 \u0437\u0430\u043f\u043e\u043b\u043d\u0435\u043d\u043e."}</p>
            </section>

            <section className={styles.gallerySection}>
              <div className={styles.galleryHeader}>
                <div>
                  <h2>{ "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u0430" }</h2>
                  <p>
                    {data.cards.length
                      ? `${"\u0413\u043e\u0442\u043e\u0432\u043e"} ${data.cards.length} ${formatCardCount(data.cards.length)}.`
                      : "\u0412 \u044d\u0442\u043e\u043c \u043f\u0440\u043e\u0435\u043a\u0442\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0441\u0433\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0445 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a."}
                  </p>
                </div>
                {selectedCard ? (
                  <Button
                    variant="darkOutline"
                    size="sm"
                    onClick={() => window.open(selectedCard.previewUrl, "_blank", "noopener,noreferrer")}
                  >
                    { "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435" }
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
                      <span>{ "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430" }</span>
                    </div>
                  </div>

                  <div className={styles.thumbGrid}>
                    {data.cards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        className={[styles.thumbButton, card.id === selectedCard.id ? styles.thumbButtonActive : ""].join(" ")}
                        onClick={() => setSelectedCardId(card.id)}
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
                    <strong>{ "\u041f\u0440\u0435\u0432\u044c\u044e \u043f\u043e\u043a\u0430 \u043d\u0435\u0442" }</strong>
                    <p>{ "\u041a\u043e\u0433\u0434\u0430 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f, \u043e\u043d\u0438 \u0431\u0443\u0434\u0443\u0442 \u043f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u0437\u0434\u0435\u0441\u044c." }</p>
                  </div>
                </div>
              )}
            </section>

            <div className={styles.actions}>
              <Button as={Link} href="/app/projects" variant="darkOutline">{ "\u041a \u0441\u043f\u0438\u0441\u043a\u0443 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432" }</Button>
              <Button
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteModalOpen(true)}
              >
                { "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442" }
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
              <h2 id="delete-project-title" className={styles.title}>{ "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442?" }</h2>
              <p className={styles.copy}>{ "\u041f\u0440\u043e\u0435\u043a\u0442 \u00ab" }{data.title}{ "\u00bb \u0438\u0441\u0447\u0435\u0437\u043d\u0435\u0442 \u0438\u0437 \u0441\u043f\u0438\u0441\u043a\u0430." }</p>
              <div className={styles.actions}>
                <Button variant="darkOutline" disabled={deleteMutation.isPending} onClick={() => setDeleteModalOpen(false)}>{ "\u041e\u0442\u043c\u0435\u043d\u0430" }</Button>
                <Button variant="danger" disabled={deleteMutation.isPending} onClick={deleteProject}>
                  {deleteMutation.isPending ? "\u0423\u0434\u0430\u043b\u044f\u0435\u043c..." : "\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}
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
  return error.message ?? "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442";
}

function formatCardCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "\u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0430";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "\u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438";
  return "\u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a";
}
