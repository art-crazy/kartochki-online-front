import styles from "./AuthFlow.module.scss";

export function ArrowLeftIcon() {
  return (
    <svg className={styles.backIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M7.25 3.25 2.5 8l4.75 4.75M3 8h10.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg className={styles.successMark} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}
