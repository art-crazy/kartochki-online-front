import type { MutableRefObject } from "react";

export type VkAuthParams = {
  state: string;
  codeVerifier: string;
};

const vkAuthParamsStorageKey = "kartochki.auth.vk.params";

export function ensureVkAuthParams(ref: MutableRefObject<VkAuthParams | null>) {
  if (!ref.current) {
    ref.current = readVkAuthParams() ?? {
      state: randomBase64Url(16),
      codeVerifier: randomBase64Url(32),
    };
    writeVkAuthParams(ref.current);
  }

  return ref.current;
}

export function clearVkAuthParams(ref: MutableRefObject<VkAuthParams | null>) {
  ref.current = null;
  window.sessionStorage.removeItem(vkAuthParamsStorageKey);
}

function readVkAuthParams() {
  const raw = window.sessionStorage.getItem(vkAuthParamsStorageKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<VkAuthParams>;
    if (typeof parsed.state === "string" && typeof parsed.codeVerifier === "string") {
      return {
        state: parsed.state,
        codeVerifier: parsed.codeVerifier,
      };
    }
  } catch {
    window.sessionStorage.removeItem(vkAuthParamsStorageKey);
  }

  return null;
}

function writeVkAuthParams(params: VkAuthParams) {
  window.sessionStorage.setItem(vkAuthParamsStorageKey, JSON.stringify(params));
}

function randomBase64Url(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
