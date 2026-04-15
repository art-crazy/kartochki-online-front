export type YaAuthSuggestInitResult = {
  handler?: () => Promise<unknown>;
};

export type YaAuthSuggest = {
  init: (
    oauthQueryParams: Record<string, string>,
    tokenPageOrigin: string,
    suggestParams?: Record<string, string | number>,
  ) => Promise<YaAuthSuggestInitResult>;
};

export const yandexClientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID ?? "";
export const yandexAuthContainerId = "yandex-auth-container";
export const yandexSuggestScriptSrc = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js";
export const yandexTokenScriptSrc = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js";

export function getYandexRedirectUri(origin: string) {
  return `${origin}/auth/yandex/token`;
}

export function getYandexAccessToken(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const token = (data as { access_token?: unknown; token?: unknown }).access_token
    ?? (data as { token?: unknown }).token;
  return typeof token === "string" ? token : "";
}

export function getYandexTokenHash(hash: string) {
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    accessToken: getYandexAccessToken({
      access_token: hashParams.get("access_token"),
      token: hashParams.get("token"),
    }),
    state: hashParams.get("state"),
  };
}
