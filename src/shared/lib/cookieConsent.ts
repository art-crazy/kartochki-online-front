export type ConsentStatus = "unknown" | "accepted" | "necessary-only";
type StoredConsentStatus = Exclude<ConsentStatus, "unknown">;

const CONSENT_KEY = "cookie_consent";
const CONSENT_VERSION = "v1";
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;
const CONSENT_EVENT = "cookie-consent:change";
const CONSENT_DECISIONS = new Set<StoredConsentStatus>(["accepted", "necessary-only"]);

function isBrowser() {
  return typeof window !== "undefined";
}

function readFromLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeToLocalStorage(value: string) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Ignore storage failures and keep the consent decision in cookie storage.
  }
}

function isStoredConsentStatus(value: string | undefined): value is StoredConsentStatus {
  return value !== undefined && CONSENT_DECISIONS.has(value as StoredConsentStatus);
}

function parseStoredConsent(rawValue: string | null | undefined): ConsentStatus {
  if (!rawValue) {
    return "unknown";
  }

  const [version, status] = rawValue.split("|");

  if (version !== CONSENT_VERSION || !isStoredConsentStatus(status)) {
    return "unknown";
  }

  return status;
}

function readConsentCookie() {
  if (!isBrowser()) {
    return null;
  }

  const cookiePrefix = `${CONSENT_KEY}=`;
  const cookieEntry = document.cookie
    .split("; ")
    .find((cookiePart) => cookiePart.startsWith(cookiePrefix));

  return cookieEntry ? decodeURIComponent(cookieEntry.slice(cookiePrefix.length)) : null;
}

export function getStoredConsent(): ConsentStatus {
  if (!isBrowser()) {
    return "unknown";
  }

  const cookieConsent = parseStoredConsent(readConsentCookie());

  if (cookieConsent !== "unknown") {
    return cookieConsent;
  }

  return parseStoredConsent(readFromLocalStorage());
}

export function saveConsent(status: StoredConsentStatus) {
  if (!isBrowser()) {
    return;
  }

  const value = `${CONSENT_VERSION}|${status}`;
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";

  writeToLocalStorage(value);
  document.cookie =
    `${CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secureFlag}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function hasConsentDecision() {
  return getStoredConsent() !== "unknown";
}

export function subscribeToConsent(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONSENT_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}
