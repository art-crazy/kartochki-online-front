import styles from "./AuthFlow.module.scss";
import { CheckIcon } from "./AuthIcons";

type ForgotSentScreenProps = {
  onForgotClick: () => void;
  onLoginClick: () => void;
  sentEmail: string;
};

export function ForgotSentScreen({ onForgotClick, onLoginClick, sentEmail }: ForgotSentScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="auth-forgot-sent-title">
      <div className={styles.successIcon}>
        <CheckIcon />
      </div>
      <h1 id="auth-forgot-sent-title" className={styles.headingCentered}>
        Письмо отправлено
      </h1>
      <p className={styles.subheadingCentered}>
        Проверьте почту <strong>{sentEmail}</strong>, там будет ссылка для сброса пароля. Письмо обычно приходит в течение минуты.
      </p>

      <button type="button" className={styles.submitButton} onClick={onLoginClick}>
        Вернуться ко входу
      </button>

      <p className={styles.footerTextCompact}>
        Не пришло письмо?{" "}
        <button type="button" className={styles.footerLink} onClick={onForgotClick}>
          Отправить снова
        </button>
      </p>
    </section>
  );
}
