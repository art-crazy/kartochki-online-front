"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createBillingAddonCheckoutMutation,
  createBillingCheckoutMutation,
  type ErrorResponse,
} from "@/shared/api";
import { Button, Input } from "@/shared/ui";
import {
  buildAddonCheckoutBody,
  buildPlanCheckoutBody,
  getCheckoutErrorMessage,
  getCheckoutModalTitle,
  getCustomerEmailCheckoutError,
  normalizeCheckoutEmail,
  validateCheckoutEmail,
  type BillingCheckoutTarget,
} from "@/views/billing/model/checkout";
import styles from "./BillingPage.module.scss";

type BillingCheckoutModalProps = {
  emailRequired: boolean;
  onClose: () => void;
  onFallbackError: (message: string) => void;
  target: BillingCheckoutTarget;
};

export function BillingCheckoutModal({
  emailRequired,
  onClose,
  onFallbackError,
  target,
}: BillingCheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [fallbackEmailRequired, setFallbackEmailRequired] = useState(false);
  const showEmailInput = emailRequired || fallbackEmailRequired;

  const checkoutMutation = useMutation({
    ...createBillingCheckoutMutation(),
    onSuccess: ({ checkout_url }) => window.location.assign(checkout_url),
    onError: (error: ErrorResponse) => handleCheckoutError(error),
  });
  const addonCheckoutMutation = useMutation({
    ...createBillingAddonCheckoutMutation(),
    onSuccess: ({ checkout_url }) => window.location.assign(checkout_url),
    onError: (error: ErrorResponse) => handleCheckoutError(error),
  });
  const isPending = checkoutMutation.isPending || addonCheckoutMutation.isPending;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = normalizeCheckoutEmail(email);
    if (showEmailInput) {
      setEmail(normalizedEmail);
      const validationError = validateCheckoutEmail(normalizedEmail);
      if (validationError) {
        setEmailError(validationError);
        return;
      }
    }

    const customerEmail = showEmailInput ? normalizedEmail : undefined;

    if (target.type === "plan") {
      checkoutMutation.mutate({ body: buildPlanCheckoutBody(target, customerEmail) });
      return;
    }

    addonCheckoutMutation.mutate({ body: buildAddonCheckoutBody(target, customerEmail) });
  }

  function handleCheckoutError(error: ErrorResponse) {
    const emailFieldError = getCustomerEmailCheckoutError(error);
    if (emailFieldError) {
      setFallbackEmailRequired(true);
      setEmailError(emailFieldError);
      return;
    }

    onFallbackError(getCheckoutErrorMessage(error));
  }

  function handleClose() {
    if (!isPending) onClose();
  }

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={handleClose}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-checkout-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 id="billing-checkout-title" className={styles.modalTitle}>{getCheckoutModalTitle(target)}</h2>
        <p className={styles.modalText}>Проверьте условия перед переходом к оплате.</p>

        <div className={styles.modalRows}>
          {target.type === "plan" ? (
            <>
              <ModalRow label="Тариф" value={target.plan.name} />
              <ModalRow label="Период" value={target.periodLabel} />
              <ModalRow label="Карточек в месяц" value={String(target.plan.cardsPerMonth)} />
              <ModalRow label="Отмена подписки" value="В любой момент" />
            </>
          ) : (
            <>
              <ModalRow label="Пакет" value={target.addon.title} />
              <ModalRow label="Описание" value={target.addon.description} />
            </>
          )}
        </div>

        {showEmailInput ? (
          <Input
            dark
            className={styles.modalEmailField}
            label="Email для чека"
            error={emailError ?? undefined}
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) setEmailError(null);
            }}
            autoComplete="email"
            placeholder="user@example.com"
          />
        ) : null}

        <div className={styles.modalTotal}>
          <span className={styles.modalTotalLabel}>Итого</span>
          <span className={styles.modalTotalPrice}>{target.totalLabel}</span>
        </div>

        <div className={styles.modalActions}>
          <Button type="button" variant="darkOutline" className={styles.modalActionButton} disabled={isPending} onClick={handleClose}>
            Отмена
          </Button>
          <Button type="submit" variant="darkPrimary" className={styles.modalActionButton} disabled={isPending}>
            {isPending ? "Открываем оплату..." : "Оплатить ->"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ModalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.modalRow}>
      <span className={styles.modalRowLabel}>{label}</span>
      <span className={styles.modalRowValue}>{value}</span>
    </div>
  );
}
