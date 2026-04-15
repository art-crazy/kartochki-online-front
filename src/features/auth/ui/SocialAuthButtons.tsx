import { VkIcon, YandexIcon } from "@/shared/ui";
import { classNames } from "@/shared/lib/classNames";
import styles from "./SocialAuthButtons.module.scss";

type SocialAuthButtonsProps = {
  error: string;
  isPending: boolean;
  yandexAuthUrl: string;
  vkAuthUrl: string;
};

export function SocialAuthButtons({ error, isPending, yandexAuthUrl, vkAuthUrl }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialBlock} aria-busy={isPending}>
      <div className={styles.divider}>
        <span>или войти через</span>
      </div>
      <div className={styles.socialGrid} aria-label="Социальные сети">
        <a className={classNames(styles.socialLink, styles.socialLinkBrandIcon)} href={yandexAuthUrl} aria-label="Войти через Яндекс ID">
          <YandexIcon />
        </a>
        <a className={classNames(styles.socialLink, styles.socialLinkBrandIcon)} href={vkAuthUrl} aria-label="Войти через VK ID">
          <VkIcon />
        </a>
      </div>
      {error ? <div className={styles.oauthError}>{error}</div> : null}
    </div>
  );
}
