import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./Primitives.module.scss";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "darkPrimary"
  | "darkOutline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

const buttonVariantClassMap: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  danger: styles.variantDanger,
  darkPrimary: styles.variantDarkPrimary,
  darkOutline: styles.variantDarkOutline,
};

const buttonSizeClassMap: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  iconOnly = false,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  const componentProps = { ...props } as ComponentPropsWithoutRef<T>;

  if (Component === "button") {
    const buttonProps = componentProps as ComponentPropsWithoutRef<"button">;
    buttonProps.type = buttonProps.type ?? "button";
    buttonProps.disabled = loading || buttonProps.disabled;
    buttonProps["aria-busy"] = loading || undefined;
  }

  return (
    <Component
      className={classNames(
        styles.button,
        buttonVariantClassMap[variant],
        buttonSizeClassMap[size],
        block && styles.isBlock,
        loading && styles.isLoading,
        iconOnly && styles.iconOnly,
        className,
      )}
      {...componentProps}
    >
      {children}
    </Component>
  );
}

type FieldProps = {
  label?: ReactNode;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  dark?: boolean;
  success?: boolean;
  className?: string;
  controlClassName?: string;
};

type InputProps = FieldProps & ComponentPropsWithoutRef<"input">;

export function Input({
  label,
  hint,
  error,
  icon,
  endAdornment,
  dark = false,
  success = false,
  className,
  controlClassName,
  ...props
}: InputProps) {
  const isInvalid = Boolean(error);

  return (
    <label className={classNames(styles.field, className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.controlWrap}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <input
          aria-invalid={isInvalid}
          className={classNames(
            styles.control,
            icon && styles.controlWithIcon,
            endAdornment && styles.controlWithEndAdornment,
            error && styles.isError,
            success && styles.isSuccess,
            dark && styles.isDark,
            controlClassName,
          )}
          {...props}
        />
        {endAdornment ? <span className={styles.endAdornment}>{endAdornment}</span> : null}
      </span>
      {error ? <span className={styles.error}>{error}</span> : null}
      {!error && hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}

type SelectProps = FieldProps & ComponentPropsWithoutRef<"select">;

export function Select({
  label,
  hint,
  error,
  dark = false,
  className,
  controlClassName,
  children,
  ...props
}: SelectProps) {
  const isInvalid = Boolean(error);

  return (
    <label className={classNames(styles.field, className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <select
        aria-invalid={isInvalid}
        className={classNames(styles.control, error && styles.isError, dark && styles.isDark, controlClassName)}
        {...props}
      >
        {children}
      </select>
      {error ? <span className={styles.error}>{error}</span> : null}
      {!error && hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}

type TextareaProps = FieldProps & ComponentPropsWithoutRef<"textarea">;

export function Textarea({
  label,
  hint,
  error,
  dark = false,
  className,
  controlClassName,
  ...props
}: TextareaProps) {
  const isInvalid = Boolean(error);

  return (
    <label className={classNames(styles.field, className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <textarea
        aria-invalid={isInvalid}
        className={classNames(styles.control, error && styles.isError, dark && styles.isDark, controlClassName)}
        rows={4}
        {...props}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
      {!error && hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}

type BadgeTone = "accent" | "success" | "danger" | "neutral" | "dark" | "wb" | "ozon" | "ym";

const badgeToneClassMap: Record<BadgeTone, string> = {
  accent: styles.badgeAccent,
  success: styles.badgeSuccess,
  danger: styles.badgeDanger,
  neutral: styles.badgeNeutral,
  dark: styles.badgeDark,
  wb: styles.badgeWb,
  ozon: styles.badgeOzon,
  ym: styles.badgeYm,
};

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
};

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return <span className={classNames(styles.badge, badgeToneClassMap[tone], className)}>{children}</span>;
}

type ChipProps = ComponentPropsWithoutRef<"button"> & {
  selected?: boolean;
  dark?: boolean;
  accentSelected?: boolean;
};

export function Chip({
  selected = false,
  dark = false,
  accentSelected = false,
  className,
  type = "button",
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={classNames(
        styles.chip,
        dark && styles.chipDark,
        selected && !dark && !accentSelected && styles.chipSelected,
        selected && accentSelected && styles.chipAccentSelected,
        selected && dark && styles.chipDarkSelected,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
