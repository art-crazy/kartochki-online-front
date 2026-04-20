const emailPattern = /\S+@\S+\.\S+/;

export function isValidEmail(email: string) {
  return emailPattern.test(email.trim());
}
