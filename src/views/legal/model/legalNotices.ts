import { buildSiteUrl, siteConfig } from "@/shared/config/site";
import type { RekvizityRow } from "./types";

const productName = siteConfig.applicationName;
const billingUrl = buildSiteUrl("/app/billing");

export const rekvizityRows: readonly RekvizityRow[] = [
  { label: "Организация", value: "Индивидуальный предприниматель Аржанников Михаил Алексеевич" },
  { label: "ИНН", value: "420544415156" },
  { label: "ОГРНИП", value: "324420500063173" },
  { label: "Сайт", value: siteConfig.domains[0] },
  { label: "Адрес электронной почты", value: siteConfig.supportEmail },
] as const;

export const checkoutLegalCopy = {
  agreementLabel:
    `Нажимая «Оплатить», пользователь подтверждает согласие с офертой и политикой конфиденциальности ${productName}.`,
  recurringNotice:
    "Оплата оформляется как подписка с автопродлением. До подтверждения платежа пользователь должен видеть сумму, период и дату следующего списания.",
  refundNotice:
    `Рядом с кнопкой оплаты должна быть ссылка на правила отмены подписки и возвратов с указанием, что отключение автопродления выполняется в разделе управления подпиской по адресу ${billingUrl}.`,
} as const;

export const paymentStatusCopy = {
  successTitle: "Оплата прошла успешно",
  successDescription:
    `Подписка активирована. Доступ к тарифу и управление автопродлением доступны в разделе управления подпиской по адресу ${billingUrl}.`,
  successCtaLabel: "Перейти к управлению подпиской",
  successCtaHref: "/app/billing",
  failureTitle: "Оплата не завершена",
  failureDescription:
    "Платеж не был подтвержден. Пользователь должен получить возможность повторить оплату и перейти к оферте, политике конфиденциальности и правилам возврата.",
} as const;
