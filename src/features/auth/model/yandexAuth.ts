export const yandexClientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID ?? "";

export function getYandexRedirectUri(origin: string) {
  return `${origin}/auth/yandex/token`;
}

export function getYandexOAuthUrl(origin: string, nextPath: string) {
  if (!yandexClientId) {
    return "";
  }

  const params = new URLSearchParams({
    client_id: yandexClientId,
    response_type: "token",
    redirect_uri: getYandexRedirectUri(origin),
    state: nextPath,
  });

  return `https://oauth.yandex.ru/authorize?${params.toString()}`;
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
