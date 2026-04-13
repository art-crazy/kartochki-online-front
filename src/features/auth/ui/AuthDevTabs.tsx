import type { AuthScreen } from "../model/types";
import { classNames } from "@/shared/lib/classNames";
import styles from "./AuthFlow.module.scss";

const screenTabs: ReadonlyArray<{ screen: AuthScreen; label: string }> = [
  { screen: "login", label: "Вход" },
  { screen: "register", label: "Регистрация" },
  { screen: "forgot", label: "Пароль" },
  { screen: "forgot-sent", label: "Письмо" },
];

type AuthDevTabsProps = {
  activeScreen: AuthScreen;
  onChange: (screen: AuthScreen) => void;
};

export function AuthDevTabs({ activeScreen, onChange }: AuthDevTabsProps) {
  return (
    <div className={styles.devTabs} aria-label="Переключение состояний формы">
      {screenTabs.map((tab) => (
        <button
          key={tab.screen}
          type="button"
          className={classNames(styles.devTab, activeScreen === tab.screen && styles.devTabActive)}
          onClick={() => onChange(tab.screen)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
