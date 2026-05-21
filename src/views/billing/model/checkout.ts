import type { CreateCheckoutRequest, ErrorResponse, PurchaseAddonRequest } from "@/shared/api";
import { isValidEmail } from "@/shared/lib/email";
import type { BillingAddon, BillingPlan } from "./content";

export type BillingCheckoutTarget =
  | {
      type: "plan";
      plan: BillingPlan;
      period: "monthly" | "yearly";
      periodLabel: string;
      totalLabel: string;
    }
  | {
      type: "addon";
      addon: BillingAddon;
      totalLabel: string;
    };

export function normalizeCheckoutEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateCheckoutEmail(email: string) {
  if (!email) return "Введите email для чека";
  if (!isValidEmail(email)) return "Введите корректный email";
  return null;
}

export function getCustomerEmailCheckoutError(error: ErrorResponse) {
  if (error.code === "email_required") return "Введите email для чека";
  if (error.code === "email_taken") return "Этот email уже используется в другом аккаунте";

  if (error.code !== "validation_error") return null;

  const customerEmailDetail = error.details?.find((detail) => isCustomerEmailField(detail.field));
  return customerEmailDetail?.message ?? null;
}

export function getCheckoutErrorMessage(error: ErrorResponse) {
  const message = error.message?.trim();
  const code = error.code?.trim();
  if (message && code) return `${message} (${code})`;
  if (message) return message;
  return "Не удалось открыть оплату";
}

export function getCheckoutModalTitle(target: BillingCheckoutTarget) {
  if (target.type === "addon") return "Купить пакет";
  return target.plan.ctaLabel;
}

export function buildPlanCheckoutBody(
  target: Extract<BillingCheckoutTarget, { type: "plan" }>,
  customerEmail?: string,
): CreateCheckoutRequest {
  return {
    plan_id: target.plan.id,
    period: target.period,
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  };
}

export function buildAddonCheckoutBody(
  target: Extract<BillingCheckoutTarget, { type: "addon" }>,
  customerEmail?: string,
): PurchaseAddonRequest {
  return {
    addon_id: target.addon.id,
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  };
}

function isCustomerEmailField(field?: string) {
  return field === "customer_email" || field?.endsWith(".customer_email");
}
