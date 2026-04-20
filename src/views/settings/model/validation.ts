import { isValidEmail } from "@/shared/lib/email";

type PasswordForm = { current: string; next: string; confirm: string };

export function validateProfileEmail(email: string): string | null {
  if (!isValidEmail(email)) return "Введите корректный email";
  return null;
}

export function validatePasswordForm(form: PasswordForm): string | null {
  if (!form.current || !form.next || !form.confirm) return "Заполните все поля";
  if (form.next !== form.confirm) return "Пароли не совпадают";
  if (form.next.length < 8) return "Минимум 8 символов";
  return null;
}
