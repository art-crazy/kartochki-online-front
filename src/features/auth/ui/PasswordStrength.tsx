import { classNames } from "@/shared/lib/classNames";
import type { getPasswordStrength } from "../model/validation";
import styles from "./AuthFlow.module.scss";

type PasswordStrengthValue = ReturnType<typeof getPasswordStrength>;

type PasswordStrengthProps = {
  value: PasswordStrengthValue;
};

export function PasswordStrength({ value }: PasswordStrengthProps) {
  return (
    <span className={styles.passwordStrength}>
      <span className={styles.passwordBars} aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={classNames(
              styles.passwordBar,
              value.score >= bar && value.tone === "weak" && styles.passwordBarWeak,
              value.score >= bar && value.tone === "medium" && styles.passwordBarMedium,
              value.score >= bar && value.tone === "strong" && styles.passwordBarStrong,
            )}
          />
        ))}
      </span>
      <span
        id="password-strength-text"
        className={classNames(
          styles.passwordStrengthText,
          value.tone === "weak" && styles.passwordStrengthWeak,
          value.tone === "medium" && styles.passwordStrengthMedium,
          value.tone === "strong" && styles.passwordStrengthStrong,
        )}
      >
        {value.label}
      </span>
    </span>
  );
}
