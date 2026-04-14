import styles from "./AuthFlow.module.scss";

type SocialAuthButtonsProps = {
  error: string;
  isPending: boolean;
};

export function SocialAuthButtons({ error, isPending }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialBlock} aria-busy={isPending}>
      <div className={styles.socialGrid}>
        <div className={styles.socialWidget}>
          <div id="yandex-auth-container" />
        </div>
        <div className={styles.socialWidget}>
          <div id="vk-auth-container" />
        </div>
      </div>
      {error ? <div className={styles.oauthError}>{error}</div> : null}
    </div>
  );
}
