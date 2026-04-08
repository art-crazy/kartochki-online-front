import { Button } from "@/shared/ui/primitives/Primitives";
import styles from "./Feedback.module.scss";

export function Toast({
  tone,
  text,
}: {
  tone: "success" | "danger" | "accent";
  text: string;
}) {
  return (
    <div className={styles.toast}>
      <span
        className={[
          styles.toastDot,
          tone === "success" ? styles.toastSuccess : tone === "danger" ? styles.toastDanger : styles.toastAccent,
        ].join(" ")}
      />
      <span className={styles.toastText}>{text}</span>
      <button type="button" className={styles.toastClose}>{"\u00D7"}</button>
    </div>
  );
}

export function ModalCard() {
  return (
    <div className={styles.modal}>
      <div className={styles.modalTitle}>Перейти на Pro</div>
      <div className={styles.modalSub}>Оплата через ЮKassa, тариф Pro на 490 ₽ в месяц.</div>
      <div className={styles.modalRow}>
        <span>Итого</span>
        <span className={styles.modalPrice}>490 ₽</span>
      </div>
      <div className={styles.modalActions}>
        <Button variant="darkOutline" block>
          Отмена
        </Button>
        <Button variant="darkPrimary" block>
          Оплатить →
        </Button>
      </div>
    </div>
  );
}

export function Spinner({
  accent = false,
  large = false,
  medium = false,
}: {
  accent?: boolean;
  large?: boolean;
  medium?: boolean;
}) {
  return (
    <div
      className={[styles.spinner, accent && styles.spinnerAccent, medium && styles.spinnerMd, large && styles.spinnerLg]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export function SkeletonCard() {
  return <div className={[styles.skeleton, styles.skeletonCard].join(" ")} />;
}

export function LoadingSteps({
  items,
}: {
  items: ReadonlyArray<{ label: string; state: "done" | "active" | "idle"; step: string }>;
}) {
  return (
    <div className={styles.loadingSteps}>
      {items.map((item) => (
        <div
          key={item.label}
          className={[
            styles.loadingStep,
            item.state === "done" && styles.loadingDone,
            item.state === "active" && styles.loadingActive,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.loadingDot}>{item.state === "done" ? "\u2713" : item.step}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

