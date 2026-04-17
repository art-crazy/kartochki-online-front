"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeSettingsPasswordMutation,
  deleteSettingsAccountMutation,
  deleteSettingsSessionMutation,
  getSettingsQueryKey,
  patchSettingsDefaultsMutation,
  patchSettingsNotificationsMutation,
  patchSettingsProfileMutation,
  postSettingsExportMutation,
  rotateSettingsApiKeyMutation,
  type ErrorResponse,
  type SettingsResponse,
} from "@/shared/api";
import type { SettingsSessionData, SettingsTabId } from "@/views/settings/model/content";
import { mapSession } from "@/views/settings/model/mappers";
import { validatePasswordForm } from "@/views/settings/model/validation";

type ToastState = { message: string; tone: "success" | "danger" };

export function useSettingsPage(settings: SettingsResponse) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [profileForm, setProfileForm] = useState(() => ({
    name: settings.profile.name,
    email: settings.profile.email ?? "",
    phone: settings.profile.phone ?? "",
    company: settings.profile.company ?? "",
  }));
  const [defaultsForm, setDefaultsForm] = useState(() => ({
    marketplaceId: settings.defaults.marketplace_id,
    cardsPerGeneration: String(settings.defaults.cards_per_generation),
    format: settings.defaults.format,
  }));
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(settings.notifications.items.map((item) => [item.key, item.enabled])),
  );
  const [sessions, setSessions] = useState<SettingsSessionData[]>(() => settings.sessions.map(mapSession));
  const [apiKey, setApiKey] = useState(settings.api_key.masked_value ?? "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, tone: ToastState["tone"] = "success") {
    setToast({ message, tone });
  }

  function invalidateSettings() {
    void queryClient.invalidateQueries({ queryKey: getSettingsQueryKey() });
  }

  const profileMutation = useMutation({
    ...patchSettingsProfileMutation(),
    onSuccess: () => {
      invalidateSettings();
      showToast("Профиль сохранен");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const defaultsMutation = useMutation({
    ...patchSettingsDefaultsMutation(),
    onSuccess: () => {
      invalidateSettings();
      showToast("Настройки по умолчанию сохранены");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const passwordMutation = useMutation({
    ...changeSettingsPasswordMutation(),
    onSuccess: () => {
      setPasswordForm({ current: "", next: "", confirm: "" });
      showToast("Пароль изменен");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const notificationsMutation = useMutation(patchSettingsNotificationsMutation());
  const sessionMutation = useMutation({
    ...deleteSettingsSessionMutation(),
    onSuccess: (_, vars) => {
      setSessions((current) => current.filter((s) => s.id !== vars.path.id));
      invalidateSettings();
      showToast("Сессия завершена");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const rotateKeyMutation = useMutation({
    ...rotateSettingsApiKeyMutation(),
    onSuccess: (data) => {
      setApiKey(data.masked_value ?? "");
      invalidateSettings();
      showToast("Ключ перевыпущен");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const exportMutation = useMutation({
    ...postSettingsExportMutation(),
    onSuccess: () => showToast("Запрос на экспорт отправлен"),
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const deleteAccountMutation = useMutation({
    ...deleteSettingsAccountMutation(),
    onSuccess: () => {
      closeDeleteModal();
      router.push("/auth");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  function saveProfile() {
    profileMutation.mutate({ body: { name: profileForm.name, email: profileForm.email, phone: profileForm.phone || undefined, company: profileForm.company || undefined } });
  }

  function saveDefaults() {
    defaultsMutation.mutate({ body: { marketplace_id: defaultsForm.marketplaceId, cards_per_generation: Number(defaultsForm.cardsPerGeneration), format: defaultsForm.format } });
  }

  function changePassword() {
    const error = validatePasswordForm(passwordForm);
    if (error) { showToast(error, "danger"); return; }
    passwordMutation.mutate({ body: { current_password: passwordForm.current, new_password: passwordForm.next } });
  }

  function toggleNotification(key: string) {
    const prev = notifications;
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    notificationsMutation.mutate(
      { body: { items: Object.entries(next).map(([k, enabled]) => ({ key: k, enabled })) } },
      { onError: () => { setNotifications(prev); showToast("Не удалось сохранить уведомления", "danger"); } },
    );
  }

  async function copyApiKey() {
    try { await navigator.clipboard.writeText(apiKey); showToast("API-ключ скопирован"); }
    catch { showToast("Не удалось скопировать ключ", "danger"); }
  }

  function closeDeleteModal() { setDeleteModalOpen(false); setDeleteConfirmInput(""); }

  return {
    activeTab,
    apiKey,
    changePassword,
    closeDeleteModal,
    copyApiKey,
    defaultsForm,
    defaultsMutation,
    deleteAccountMutation,
    deleteConfirmInput,
    deleteModalOpen,
    exportMutation,
    notifications,
    notificationsMutation,
    passwordForm,
    passwordMutation,
    profileForm,
    profileMutation,
    rotateKeyMutation,
    saveDefaults,
    saveProfile,
    sessionMutation,
    sessions,
    setActiveTab,
    setDefaultsForm,
    setDeleteConfirmInput,
    setDeleteModalOpen,
    setPasswordForm,
    setProfileForm,
    setShowApiKey,
    showApiKey,
    showToast,
    toast,
    toggleNotification,
  };
}
