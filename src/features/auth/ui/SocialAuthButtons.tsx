import styles from "./SocialAuthButtons.module.scss";

type SocialAuthButtonsProps = {
  error: string;
  isPending: boolean;
  yandexAuthUrl: string;
};

export function SocialAuthButtons({ error, isPending, yandexAuthUrl }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialBlock} aria-busy={isPending}>
      <div className={styles.socialGrid}>
        <a className={styles.yandexLink} href={yandexAuthUrl || undefined} aria-disabled={!yandexAuthUrl}>
          <span className={styles.yandexMark}>Я</span>
          Войти через Яндекс ID
        </a>
        <div className={styles.vkWidget}>
          <div id="vk-auth-container" />
        </div>
      </div>
      {error ? <div className={styles.oauthError}>{error}</div> : null}
    </div>
  );
}
