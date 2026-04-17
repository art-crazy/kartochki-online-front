const STORAGE_KEY = "auth-register-verification";

type RegisterVerificationSnapshot = {
  email: string;
  codeLength: number;
  verificationId: string;
  expiresAt: number | null;
  resendAvailableAt: number | null;
};

export function loadRegisterVerificationSnapshot(): RegisterVerificationSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as RegisterVerificationSnapshot;
    if (!parsed.verificationId || !parsed.email || !parsed.codeLength) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveRegisterVerificationSnapshot(snapshot: RegisterVerificationSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearRegisterVerificationSnapshot() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
