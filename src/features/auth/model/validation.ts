const emailPattern = /\S+@\S+\.\S+/;

export function validateEmail(email: string) {
  return emailPattern.test(email.trim());
}

export function getPasswordStrength(password: string) {
  if (!password) {
    return { score: 0, label: "", tone: "neutral" as const };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/\p{L}/u.test(password)) {
    score += 1;
  }

  if (/\d/.test(password) || /[^\p{L}\d]/u.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { score: 1, label: "Слабый пароль", tone: "weak" as const };
  }

  if (score === 2) {
    return { score: 2, label: "Средний пароль", tone: "medium" as const };
  }

  return { score: 3, label: "Надёжный пароль", tone: "strong" as const };
}

export function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

export function sanitizeVerificationCode(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  if (minutes === 0) {
    return `${seconds} сек`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
