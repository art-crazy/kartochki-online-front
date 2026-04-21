import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./Composite.module.scss";
import { CardSurface } from "./CardSurface";
export { BlogCard } from "./BlogCard";
export { CardSurface } from "./CardSurface";

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  valueLabel?: string;
  tone?: "accent" | "success" | "danger";
  dark?: boolean;
};

export function ProgressBar({
  value,
  max,
  label,
  valueLabel,
  tone = "accent",
  dark = false,
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 1 : max;
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  const fillClass =
    tone === "success" ? styles.progressSuccess : tone === "danger" ? styles.progressDanger : styles.progressAccent;

  return (
    <div className={styles.progress}>
      <div className={classNames(styles.progressLabelRow, dark && styles.progressLabelRowDark)}>
        <span className={classNames(styles.progressLabel, dark && styles.progressLabelDark)}>{label}</span>
        <span className={classNames(styles.progressValue, dark && styles.progressValueDark)}>
          {valueLabel ?? `${value} / ${max}`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.min(value, safeMax)}
        className={classNames(styles.progressTrack, dark && styles.progressTrackDark)}
      >
        <div className={classNames(styles.progressFill, fillClass)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  description: ReactNode;
  progress?: ProgressBarProps;
};

export function StatCard({ label, value, description, progress }: StatCardProps) {
  return (
    <CardSurface theme="dark" className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statSub}>{description}</div>
      {progress ? <ProgressBar dark {...progress} /> : null}
    </CardSurface>
  );
}

type ProjectCardContentProps = {
  title: string;
  meta: string;
  badge: ReactNode;
  previews: ReadonlyArray<string>;
  addCard?: false;
};

type ProjectCardAddProps = {
  addCard: true;
};

type ProjectCardProps = ProjectCardContentProps | ProjectCardAddProps;

export function ProjectCard(props: ProjectCardProps) {
  return (
    <CardSurface theme="dark" className={classNames(styles.projectCard, props.addCard && styles.projectCardAddSurface)}>
      {props.addCard ? (
        <div className={styles.projectCardAdd}>
          <div>+</div>
          <div>Новый проект</div>
        </div>
      ) : (
        <>
          <div className={styles.projectCardPreview}>
            {props.previews.map((preview) => (
              <div key={preview} className={styles.projectCardThumb} style={{ background: preview }} />
            ))}
          </div>
          <div className={styles.projectCardBody}>
            <div>
              <div className={styles.projectCardName}>{props.title}</div>
              <div className={styles.projectCardMeta}>
                <span>{props.meta}</span>
                {props.badge}
              </div>
            </div>
          </div>
        </>
      )}
    </CardSurface>
  );
}

type PlanCardProps = {
  name: string;
  price: string;
  period: string;
  features: ReadonlyArray<{ label: string; enabled: boolean }>;
  popular?: boolean;
  action: ReactNode;
  wide?: boolean;
};

export function PlanCard({ name, price, period, features, popular = false, action, wide = false }: PlanCardProps) {
  if (wide) {
    return (
      <CardSurface className={classNames(styles.planCard, styles.planCardWide, popular && styles.planPopular)}>
        {popular ? <div className={styles.planPopularBadge}>Популярный</div> : null}
        <div className={styles.planWideLeft}>
          <div className={styles.planName}>{name}</div>
          <div className={styles.planPrice}>{price}</div>
          <div className={styles.planPeriod}>{period}</div>
        </div>
        <div className={styles.planWideDivider} />
        <ul className={classNames(styles.planFeatures, styles.planFeaturesWide)}>
          {features.map((feature) => (
            <li key={feature.label} className={styles.planFeatureItem}>
              <span className={feature.enabled ? styles.planYes : styles.planNo}>{feature.enabled ? "✓" : "✗"}</span>
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.planWideAction}>{action}</div>
      </CardSurface>
    );
  }

  return (
    <CardSurface className={classNames(styles.planCard, popular && styles.planPopular)}>
      {popular ? <div className={styles.planPopularBadge}>Популярный</div> : null}
      <div className={styles.planName}>{name}</div>
      <div className={styles.planPrice}>{price}</div>
      <div className={styles.planPeriod}>{period}</div>
      <div className={styles.planDivider} />
      <ul className={styles.planFeatures}>
        {features.map((feature) => (
          <li key={feature.label} className={styles.planFeatureItem}>
            <span className={feature.enabled ? styles.planYes : styles.planNo}>{feature.enabled ? "✓" : "✗"}</span>
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
      {action}
    </CardSurface>
  );
}

type ResultCardProps = {
  title: string;
  gradient: string;
};

export function ResultCard({ title, gradient }: ResultCardProps) {
  return (
    <CardSurface theme="dark" className={styles.resultCard}>
      <div className={styles.resultVisual} style={{ background: gradient }}>
        <div className={styles.resultOverlay}>
          <button type="button" className={styles.resultOverlayButton}>
            ↓ Скачать
          </button>
        </div>
      </div>
      <div className={styles.resultFooter}>
        <span className={styles.resultLabel}>{title}</span>
        <button type="button" className={styles.iconCircleButton}>
          ↓
        </button>
      </div>
    </CardSurface>
  );
}

type SwitchProps = {
  checked: boolean;
  label: string;
  description: string;
  accent?: boolean;
  onToggle: () => void;
};

export function Switch({ checked, label, description, accent = false, onToggle }: SwitchProps) {
  return (
    <div className={styles.switchRow}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={classNames(styles.switchControl, checked && styles.switchOn, accent && checked && styles.switchAccent)}
      >
        <span className={styles.switchKnob} />
      </button>
      <div>
        <div className={styles.switchLabel}>{label}</div>
        <div className={styles.switchDescription}>{description}</div>
      </div>
    </div>
  );
}

type UploadZoneProps = {
  title: string;
  description: string;
  state?: "idle" | "dragOver" | "file";
};

export function UploadZone({ title, description, state = "idle" }: UploadZoneProps) {
  return (
    <div
      className={classNames(
        styles.uploadZone,
        state === "dragOver" && styles.uploadDragOver,
        state === "file" && styles.uploadHasFile,
      )}
    >
      <span className={styles.uploadIcon}>{state === "file" ? "✓" : "↑"}</span>
      <div className={styles.uploadTitle}>{title}</div>
      <div className={styles.uploadSub}>{description}</div>
    </div>
  );
}

type PlatformOption = {
  value: string;
  shortLabel: string;
  tone: "wb" | "ozon" | "ym";
};

type PlatformSelectorProps = {
  options: ReadonlyArray<PlatformOption>;
  value: string;
  onChange: (value: string) => void;
};

export function PlatformSelector({ options, value, onChange }: PlatformSelectorProps) {
  return (
    <div className={styles.platformSelector}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          className={classNames(
            styles.platformButton,
            option.tone === "wb" && styles.platformWb,
            option.tone === "ozon" && styles.platformOzon,
            option.tone === "ym" && styles.platformYm,
            value === option.value && styles.platformSelected,
          )}
          onClick={() => onChange(option.value)}
        >
          {option.shortLabel}
        </button>
      ))}
    </div>
  );
}

type CardPreviewGridProps = {
  previews: ReadonlyArray<string>;
};

export function CardPreviewGrid({ previews }: CardPreviewGridProps) {
  return (
    <div className={styles.projectCardPreview} style={{ gridTemplateColumns: `repeat(${previews.length}, minmax(0, 1fr))` }}>
      {previews.map((preview) => (
        <div key={preview} className={styles.gradientSwatch} style={{ background: preview }} />
      ))}
    </div>
  );
}
