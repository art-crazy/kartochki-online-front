"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getStoredConsent, saveConsent, subscribeToConsent, type ConsentStatus } from "@/shared/lib/cookieConsent";
import { Button } from "@/shared/ui";
import styles from "./CookieConsentBanner.module.scss";

const consentMessage =
  "Мы используем cookie и локальное хранилище, чтобы сайт работал стабильно, запоминал настройки и упрощал вход. Можно принять все cookie или оставить только необходимые.";

export function CookieConsentBanner() {
  const consentStatus = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => "unknown" satisfies ConsentStatus);

  function handleConsent(status: Exclude<ConsentStatus, "unknown">) {
    saveConsent(status);
  }

  if (consentStatus !== "unknown") {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <section className={styles.banner} aria-label="Уведомление об использовании cookie">
        <div className={styles.content}>
          <p className={styles.text}>{consentMessage}</p>
          <Link href="/consent" className={styles.link}>
            Подробнее
          </Link>
        </div>

        <div className={styles.actions}>
          <Button size="md" variant="outline" className={styles.actionButton} onClick={() => handleConsent("necessary-only")}>
            Только необходимые
          </Button>
          <Button size="md" className={styles.actionButton} onClick={() => handleConsent("accepted")}>
            Принять
          </Button>
        </div>
      </section>
    </div>
  );
}
