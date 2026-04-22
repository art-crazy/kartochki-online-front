"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () => import("@/widgets/marketing/cookie-consent").then((mod) => mod.CookieConsentBanner),
  { ssr: false },
);

export function CookieConsentSlot() {
  return <CookieConsentBanner />;
}

