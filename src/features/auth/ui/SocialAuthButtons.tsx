import { classNames } from "@/shared/lib/classNames";
import { yandexAuthContainerId } from "../model/yandexAuth";
import styles from "./AuthFlow.module.scss";

type SocialAuthButtonsProps = {
  error: string;
  isPending: boolean;
  yandexFallbackUrl: string;
};

export function SocialAuthButtons({ error, isPending, yandexFallbackUrl }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialBlock} aria-busy={isPending}>
      <div className={styles.socialGrid}>
        <div className={styles.yandexWidget}>
          {yandexFallbackUrl ? (
            <a className={styles.socialButton} href={yandexFallbackUrl}>
              <span className={classNames(styles.socialIcon, styles.yandexIcon)}>Я</span>
              Войти через Яндекс ID
            </a>
          ) : (
            <div id={yandexAuthContainerId} />
          )}
        </div>
        <div className={styles.vkWidget}>
          <div id="vk-auth-container" />
        </div>
      </div>
      {error ? <div className={styles.oauthError}>{error}</div> : null}
    </div>
  );
}
