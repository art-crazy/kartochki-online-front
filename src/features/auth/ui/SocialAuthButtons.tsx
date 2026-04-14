import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

const VK_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/v1/auth/vk/start`;

type SocialAuthButtonsProps = {
  yandexError: string;
};

export function SocialAuthButtons({ yandexError }: SocialAuthButtonsProps) {
  return (
    <div className={styles.socialGrid}>
      <div className={styles.yandexWidget}>
        <div id="yandex-auth-container" />
        {yandexError ? <div className={styles.oauthError}>{yandexError}</div> : null}
      </div>
      <a href={VK_AUTH_URL} className={styles.socialButton}>
        <span className={classNames(styles.socialIcon, styles.vkIcon)}>VK</span>
        Войти через VK
      </a>
    </div>
  );
}
