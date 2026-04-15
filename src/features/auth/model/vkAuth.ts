import { computeCodeChallenge, randomBase64Url } from "./pkce";

const vkAppId = process.env.NEXT_PUBLIC_VK_ID_APP_ID ?? "";

export function normalizeVkOrigin(origin: string) {
  return origin.replace("://0.0.0.0", "://localhost");
}

export function getVkRedirectUri(origin: string) {
  return `${origin}/auth/vk/callback`;
}

export async function getVkOAuthParams(origin: string) {
  if (!vkAppId) {
    return null;
  }

  const state = randomBase64Url(16);
  const codeVerifier = randomBase64Url(32);
  const codeChallenge = await computeCodeChallenge(codeVerifier);
  const redirectUri = getVkRedirectUri(origin);

  const url = new URL("https://id.vk.com/authorize");
  url.searchParams.set("app_id", vkAppId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return { state, codeVerifier, redirectUri, authUrl: url.toString() };
}
