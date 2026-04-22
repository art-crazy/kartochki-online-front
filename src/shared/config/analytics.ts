const fallbackYandexMetrikaId = 108720735;
const isDevelopment = process.env.NODE_ENV === "development";

function parseBooleanFlag(value: string | undefined) {
  if (value === undefined) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true" || normalizedValue === "1") {
    return true;
  }

  if (normalizedValue === "false" || normalizedValue === "0") {
    return false;
  }

  return null;
}

function parseCounterId(value: string | undefined, fallback: number) {
  if (value === undefined) {
    return fallback;
  }

  const normalizedValue = value.trim();

  if (normalizedValue === "" || normalizedValue === "0") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

const yandexMetrikaId = parseCounterId(
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID,
  fallbackYandexMetrikaId,
);
const yandexMetrikaEnabledOverride = parseBooleanFlag(
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ENABLED,
);
const yandexMetrikaEnabled =
  yandexMetrikaEnabledOverride ?? (!isDevelopment && yandexMetrikaId !== null);

export const analyticsConfig = {
  yandexMetrika: {
    enabled: yandexMetrikaEnabled,
    counterId: yandexMetrikaId,
    tagScriptUrl:
      yandexMetrikaId === null
        ? null
        : `https://mc.yandex.ru/metrika/tag.js?id=${yandexMetrikaId}`,
    watchUrl:
      yandexMetrikaId === null
        ? null
        : `https://mc.yandex.ru/watch/${yandexMetrikaId}`,
    ecommerceLayer: "dataLayer",
    initOptions: {
      ssr: true,
      webvisor: true,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    },
  },
} as const;
