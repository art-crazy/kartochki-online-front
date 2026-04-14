export function getUserInitials(name?: string, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
    if (initials) return initials;
  }

  if (email) {
    return email[0]?.toUpperCase() ?? "";
  }

  return "";
}
