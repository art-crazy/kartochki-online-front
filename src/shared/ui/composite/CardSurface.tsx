import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import styles from "./Composite.module.scss";

type CardSurfaceProps = {
  theme?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

export function CardSurface({ theme = "light", className, children }: CardSurfaceProps) {
  return (
    <div className={classNames(styles.card, theme === "dark" ? styles.cardDark : styles.cardLight, className)}>
      {children}
    </div>
  );
}
