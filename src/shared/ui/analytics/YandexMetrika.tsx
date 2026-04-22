import Script from "next/script";
import { analyticsConfig } from "@/shared/config/analytics";

const {
  enabled,
  counterId,
  ecommerceLayer,
  initOptions,
  tagScriptUrl,
  watchUrl,
} = analyticsConfig.yandexMetrika;

const yandexMetrikaBootstrap = `
  window.ym = window.ym || function() {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();
`;

const yandexMetrikaInit = `
  window.ym(${counterId}, 'init', {
    ssr: ${String(initOptions.ssr)},
    webvisor: ${String(initOptions.webvisor)},
    clickmap: ${String(initOptions.clickmap)},
    ecommerce: '${ecommerceLayer}',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: ${String(initOptions.accurateTrackBounce)},
    trackLinks: ${String(initOptions.trackLinks)}
  });
`;

export function YandexMetrika() {
  if (!enabled || counterId === null || tagScriptUrl === null || watchUrl === null) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrika-bootstrap" strategy="afterInteractive">
        {yandexMetrikaBootstrap}
      </Script>
      <Script
        id="yandex-metrika-tag"
        src={tagScriptUrl}
        strategy="afterInteractive"
      />
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {yandexMetrikaInit}
      </Script>
      <noscript>
        <div>
          {/* Yandex Metrika noscript fallback requires a plain tracking pixel. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={watchUrl}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
