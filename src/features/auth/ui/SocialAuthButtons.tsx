import Link from "next/link";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

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
      <Link href="/api/auth/vk/start" className={styles.socialButton}>
        <span className={classNames(styles.socialIcon, styles.vkIcon)}>VK</span>
        Войти через VK
      </Link>
    </div>
  );
}
