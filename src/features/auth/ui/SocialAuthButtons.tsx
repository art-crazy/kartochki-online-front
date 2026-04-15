import { yandexAuthContainerId } from "../model/yandexAuth";
import styles from "./SocialAuthButtons.module.scss";

type SocialAuthButtonsProps = {
  error: string;
  isPending: boolean;
};

export function SocialAuthButtons({ error, isPending }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialBlock} aria-busy={isPending}>
      <div className={styles.socialGrid}>
        <div className={styles.yandexButton}>
          <div id={yandexAuthContainerId} />
        </div>
        <div className={styles.vkWidget}>
          <div id="vk-auth-container" />
        </div>
      </div>
      {error ? <div className={styles.oauthError}>{error}</div> : null}
    </div>
  );
}
