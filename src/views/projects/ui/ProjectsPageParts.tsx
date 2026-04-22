import type { ReactNode } from "react";
import Link from "next/link";
import { getMarketplaceLabel, type ProjectListItem } from "@/entities/project";
import { Badge, Button, CardSurface, Input, Select, Textarea } from "@/shared/ui";
import styles from "./ProjectsPage.module.scss";

export type ProjectDraft = {
  title: string;
  marketplace: string;
  productName: string;
  productDescription: string;
};

const marketplaceOptions = [
  { value: "wildberries", label: "Wildberries" },
  { value: "ozon", label: "Ozon" },
  { value: "yandex_market", label: "Яндекс Маркет" },
] as const;

export function ProjectForm({
  draft,
  isSubmitting,
  onClose,
  onDraftChange,
  onSubmit,
  submitLabel,
  title,
}: {
  draft: ProjectDraft;
  isSubmitting: boolean;
  onClose: () => void;
  onDraftChange: (draft: ProjectDraft) => void;
  onSubmit: () => void;
  submitLabel: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <Button variant="darkOutline" size="sm" onClick={onClose}>Закрыть</Button>
      </div>
      <div className={styles.formGrid}>
        <Input dark label="Название" value={draft.title} onChange={(event) => onDraftChange({ ...draft, title: event.target.value })} />
        <Select dark label="Маркетплейс" value={draft.marketplace} onChange={(event) => onDraftChange({ ...draft, marketplace: event.target.value })}>
          {marketplaceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Input dark label="Товар" value={draft.productName} onChange={(event) => onDraftChange({ ...draft, productName: event.target.value })} />
        <Textarea dark label="Описание товара" value={draft.productDescription} onChange={(event) => onDraftChange({ ...draft, productDescription: event.target.value })} />
      </div>
      <Button variant="darkPrimary" disabled={isSubmitting} onClick={onSubmit}>
        {isSubmitting ? "Сохраняем..." : submitLabel}
      </Button>
    </CardSurface>
  );
}

export function ProjectRow({
  deletePending,
  onDelete,
  onEdit,
  project,
}: {
  deletePending: boolean;
  onDelete: () => void;
  onEdit: () => void;
  project: ProjectListItem;
}) {
  return (
    <CardSurface theme="dark" className={styles.projectRow}>
      <div className={styles.projectBody}>
        <div className={styles.projectTitleRow}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <Badge tone="dark" className={styles.projectMarketplaceBadge}>{getMarketplaceLabel(project.marketplace)}</Badge>
        </div>
        <p className={styles.projectMeta}>Обновлен: {project.updatedAt}</p>
        {project.productName ? <p className={styles.projectCopy}>{project.productName}</p> : null}
      </div>
      <div className={styles.projectActions}>
        <Button as={Link} href={`/app/projects/${project.id}`} variant="darkOutline" size="sm">Открыть</Button>
        <Button variant="darkOutline" size="sm" onClick={onEdit}>Изменить</Button>
        <Button variant="danger" size="sm" disabled={deletePending} onClick={onDelete}>Удалить</Button>
      </div>
    </CardSurface>
  );
}

export function ProjectsStatus({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.statusCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.statusText}>{description}</p>
      {action ? <div className={styles.statusAction}>{action}</div> : null}
    </CardSurface>
  );
}
