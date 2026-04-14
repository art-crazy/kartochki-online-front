"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changeSettingsPasswordMutation,
  deleteSettingsAccountMutation,
  deleteSettingsSessionMutation,
  getSettingsOptions,
  patchSettingsDefaultsMutation,
  patchSettingsNotificationsMutation,
  patchSettingsProfileMutation,
  postSettingsExportMutation,
  rotateSettingsApiKeyMutation,
  type ErrorResponse,
} from "@/shared/api";
import { classNames } from "@/shared/lib/classNames";
import { getUserInitials } from "@/shared/lib/user";
import { Avatar, Button, CardSurface, Input, Select } from "@/shared/ui";
import {
  deleteConfirmWord,
  notificationLabels,
  settingsTabs,
  type SettingsSessionData,
  type SettingsTabId,
} from "@/views/settings/model/content";
import { mapSession } from "@/views/settings/model/mappers";
import { validatePasswordForm } from "@/views/settings/model/validation";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./SettingsPage.module.scss";

type ToastState = { message: string; tone: "success" | "danger" };

export function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");
  const [toast, setToast] = useState<ToastState | null>(null);

  const { data: settings } = useQuery(getSettingsOptions());

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [defaultsForm, setDefaultsForm] = useState({ marketplaceId: "wildberries", cardsPerGeneration: "10", format: "png" as "png" | "jpg" | "webp" });
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [sessions, setSessions] = useState<SettingsSessionData[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // Sync local state from query data when loaded
  useEffect(() => {
    if (!settings) return;
    setProfileForm({
      name: settings.profile.name,
      email: settings.profile.email,
      phone: settings.profile.phone ?? "",
      company: settings.profile.company ?? "",
    });
    setDefaultsForm({
      marketplaceId: settings.defaults.marketplace_id,
      cardsPerGeneration: String(settings.defaults.cards_per_generation),
      format: settings.defaults.format,
    });
    setNotifications(Object.fromEntries(settings.notifications.items.map((item) => [item.key, item.enabled])));
    setSessions(settings.sessions.map(mapSession));
    setApiKey(settings.api_key.masked_value ?? "");
  }, [settings]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, tone: ToastState["tone"] = "success") {
    setToast({ message, tone });
  }

  const profileMutation = useMutation({
    ...patchSettingsProfileMutation(),
    onSuccess: () => showToast("Профиль сохранён"),
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const defaultsMutation = useMutation({
    ...patchSettingsDefaultsMutation(),
    onSuccess: () => showToast("Настройки по умолчанию сохранены"),
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const passwordMutation = useMutation({
    ...changeSettingsPasswordMutation(),
    onSuccess: () => {
      setPasswordForm({ current: "", next: "", confirm: "" });
      showToast("Пароль изменён");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const notificationsMutation = useMutation(patchSettingsNotificationsMutation());

  const sessionMutation = useMutation({
    ...deleteSettingsSessionMutation(),
    onSuccess: (_, vars) => {
      setSessions((current) => current.filter((s) => s.id !== vars.path.id));
      showToast("Сессия завершена");
    },
    onError: (err: ErrorResponse) => showToast(err.message ?? "Ошибка", "danger"),
  });

  const rotateKeyMutation = useMutation({
    ...rotateSettingsApiKeyMutation(),
    onSuccess: (data) => {
      setApiKey(data.masked_value ?? apiKey);
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

  const emailNotifications = Object.entries(notificationLabels).filter(([, v]) => v.group === "email");
  const securityNotifications = Object.entries(notificationLabels).filter(([, v]) => v.group === "security");
  const initials = getUserInitials(settings?.profile.name, settings?.profile.email);

  return (
    <AppShell title="Настройки" subtitle="Профиль, безопасность, уведомления и интеграции" activeKey="settings">
      <main className={styles.page}>
        <div className={styles.layout}>
          <nav className={styles.tabs} aria-label="Разделы настроек" role="tablist" aria-orientation="vertical">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`settings-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={classNames(styles.tabButton, activeTab === tab.id && styles.tabButtonActive)}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.panels}>
            {/* Profile */}
            <section id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" hidden={activeTab !== "profile"} className={activeTab === "profile" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Фото профиля" subtitle="Изображение аккаунта и публичные данные профиля.">
                <div className={styles.avatarRow}>
                  <div className={styles.avatarWrap}>
                    <Avatar initials={initials} size="xl" />
                    <span className={styles.avatarEdit} aria-hidden="true">✎</span>
                  </div>
                  <div className={styles.avatarMeta}>
                    <div className={styles.avatarName}>{settings?.profile.name}</div>
                    <div className={styles.avatarEmail}>{settings?.profile.email}</div>
                    <div className={styles.avatarActions}>
                      <Button variant="darkPrimary" size="sm" onClick={() => showToast("Загрузка аватара будет подключена позже")}>Загрузить фото</Button>
                      <Button variant="darkOutline" size="sm" onClick={() => showToast("Аватар удалён")}>Удалить</Button>
                    </div>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard title="Личные данные" subtitle="Контактные данные и информация о компании.">
                <div className={styles.formGrid}>
                  <Input dark label="Имя и фамилия" value={profileForm.name} onChange={(e) => setProfileForm((c) => ({ ...c, name: e.target.value }))} />
                  <Input dark label="Email" type="email" value={profileForm.email} onChange={(e) => setProfileForm((c) => ({ ...c, email: e.target.value }))} />
                  <Input dark label="Телефон" value={profileForm.phone} onChange={(e) => setProfileForm((c) => ({ ...c, phone: e.target.value }))} />
                  <Input dark label="Компания" value={profileForm.company} onChange={(e) => setProfileForm((c) => ({ ...c, company: e.target.value }))} />
                </div>
                <div className={styles.rowActions}>
                  <Button variant="darkPrimary" disabled={profileMutation.isPending} onClick={saveProfile}>
                    {profileMutation.isPending ? "Сохраняем..." : "Сохранить изменения"}
                  </Button>
                </div>
              </SettingsCard>

              <SettingsCard title="Настройки по умолчанию" subtitle="Базовые параметры новых генераций карточек.">
                <div className={styles.formGrid}>
                  <Select dark label="Основной маркетплейс" value={defaultsForm.marketplaceId} onChange={(e) => setDefaultsForm((c) => ({ ...c, marketplaceId: e.target.value }))}>
                    <option value="wildberries">Wildberries</option>
                    <option value="ozon">Ozon</option>
                    <option value="yandex_market">Яндекс Маркет</option>
                  </Select>
                  <Select dark label="Карточек за генерацию" value={defaultsForm.cardsPerGeneration} onChange={(e) => setDefaultsForm((c) => ({ ...c, cardsPerGeneration: e.target.value }))}>
                    <option value="6">6 карточек</option>
                    <option value="10">10 карточек</option>
                    <option value="15">15 карточек</option>
                  </Select>
                  <Select dark label="Формат" value={defaultsForm.format} onChange={(e) => setDefaultsForm((c) => ({ ...c, format: e.target.value as "png" | "jpg" | "webp" }))}>
                    <option value="png">PNG</option>
                    <option value="jpg">JPEG</option>
                    <option value="webp">WebP</option>
                  </Select>
                </div>
                <Button variant="darkOutline" disabled={defaultsMutation.isPending} onClick={saveDefaults}>
                  {defaultsMutation.isPending ? "Сохраняем..." : "Сохранить по умолчанию"}
                </Button>
              </SettingsCard>
            </section>

            {/* Security */}
            <section id="settings-panel-security" role="tabpanel" aria-labelledby="settings-tab-security" hidden={activeTab !== "security"} className={activeTab === "security" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Смена пароля" subtitle="Последнее изменение: никогда.">
                <div className={styles.stack}>
                  <Input dark label="Текущий пароль" type="password" placeholder="••••••••" value={passwordForm.current} onChange={(e) => setPasswordForm((c) => ({ ...c, current: e.target.value }))} />
                  <Input dark label="Новый пароль" type="password" placeholder="Минимум 8 символов" value={passwordForm.next} onChange={(e) => setPasswordForm((c) => ({ ...c, next: e.target.value }))} />
                  <Input dark label="Повторите новый пароль" type="password" placeholder="••••••••" value={passwordForm.confirm} onChange={(e) => setPasswordForm((c) => ({ ...c, confirm: e.target.value }))} />
                </div>
                <Button variant="darkPrimary" disabled={passwordMutation.isPending} onClick={changePassword}>
                  {passwordMutation.isPending ? "Сохраняем..." : "Изменить пароль"}
                </Button>
              </SettingsCard>

              <SettingsCard title="Двухфакторная аутентификация" subtitle="Дополнительная защита аккаунта при входе.">
                <div className={styles.stack}>
                  {securityNotifications.map(([key, meta]) => (
                    <SwitchRow key={key} checked={notifications[key] ?? false} title={meta.title} description={meta.description} disabled={notificationsMutation.isPending} onToggle={() => toggleNotification(key)} />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Активные сессии" subtitle="Устройства с активным входом в аккаунт.">
                <div className={styles.stack}>
                  {sessions.map((session) => (
                    <div key={session.id} className={styles.listRow}>
                      <div className={styles.listIcon} aria-hidden="true">{session.platform.toLowerCase().includes("mobile") ? "📱" : "💻"}</div>
                      <div className={styles.listBody}>
                        <div className={styles.listTitle}>{session.device} · {session.platform}</div>
                        <div className={session.isCurrent ? styles.listMetaSuccess : styles.listMetaMuted}>
                          {session.isCurrent ? `Текущая сессия${session.location ? ` · ${session.location}` : ""}` : session.location}
                        </div>
                      </div>
                      {session.canRevoke ? (
                        <Button variant="darkOutline" size="sm" disabled={sessionMutation.isPending} onClick={() => sessionMutation.mutate({ path: { id: session.id } })}>
                          Завершить
                        </Button>
                      ) : null}
                    </div>
                  ))}
                  {sessions.length === 0 ? <p className={styles.listMetaMuted}>Нет активных сессий</p> : null}
                </div>
              </SettingsCard>
            </section>

            {/* Notifications */}
            <section id="settings-panel-notifications" role="tabpanel" aria-labelledby="settings-tab-notifications" hidden={activeTab !== "notifications"} className={activeTab === "notifications" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Email-уведомления" subtitle={`На адрес ${settings?.profile.email ?? ""}.`}>
                <div className={styles.stack}>
                  {emailNotifications.map(([key, meta]) => (
                    <SwitchRow key={key} checked={notifications[key] ?? false} title={meta.title} description={meta.description} disabled={notificationsMutation.isPending} onToggle={() => toggleNotification(key)} />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Telegram-уведомления" subtitle="Мгновенные оповещения в мессенджере.">
                <div className={styles.listRow}>
                  <div className={styles.listBody}>
                    <div className={styles.listTitle}>Подключить Telegram-бота</div>
                    <div className={styles.listMetaMuted}>Уведомления о готовых карточках и событиях аккаунта.</div>
                  </div>
                  <Button variant="darkOutline" size="sm" onClick={() => showToast("Открываем Telegram-бота...")}>Подключить</Button>
                </div>
              </SettingsCard>
            </section>

            {/* Integrations */}
            <section id="settings-panel-integrations" role="tabpanel" aria-labelledby="settings-tab-integrations" hidden={activeTab !== "integrations"} className={activeTab === "integrations" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Подключённые аккаунты" subtitle="Для быстрого входа и внешних интеграций.">
                <div className={styles.stack}>
                  {(settings?.integrations ?? []).map((account) => (
                    <div key={account.id ?? account.provider} className={styles.listRow}>
                      <div className={styles.listIcon} aria-hidden="true">{account.provider === "google" ? "G" : "✈"}</div>
                      <div className={styles.listBody}>
                        <div className={styles.listTitle}>{account.provider}</div>
                        <div className={account.connected ? styles.listMetaSuccess : styles.listMetaMuted}>
                          {account.connected ? `Подключён${account.account_email ? ` · ${account.account_email}` : ""}` : "Не подключён"}
                        </div>
                      </div>
                      <Button variant="darkOutline" size="sm" onClick={() => showToast(account.connected ? "Аккаунт отключён" : "Открываем подключение...")}>
                        {account.connected ? "Отключить" : "Подключить"}
                      </Button>
                    </div>
                  ))}
                  {(settings?.integrations ?? []).length === 0 ? <p className={styles.listMetaMuted}>Нет подключённых аккаунтов</p> : null}
                </div>
              </SettingsCard>

              <SettingsCard title="API-ключ" subtitle="Для интеграции с вашими системами на тарифе Бизнес.">
                <div className={styles.stack}>
                  <div className={styles.apiRow}>
                    <Input dark label="Ваш API-ключ" readOnly type={showApiKey ? "text" : "password"} value={apiKey} />
                    <div className={styles.apiActions}>
                      <Button variant="darkOutline" onClick={() => setShowApiKey((c) => !c)}>{showApiKey ? "Скрыть" : "Показать"}</Button>
                      <Button variant="darkOutline" onClick={() => void copyApiKey()}>Копировать</Button>
                    </div>
                  </div>
                  {settings?.api_key.can_rotate ? (
                    <Button variant="danger" disabled={rotateKeyMutation.isPending} onClick={() => rotateKeyMutation.mutate({})}>
                      {rotateKeyMutation.isPending ? "Перевыпускаем..." : "Перевыпустить ключ"}
                    </Button>
                  ) : null}
                </div>
              </SettingsCard>
            </section>

            {/* Danger zone */}
            <section id="settings-panel-danger" role="tabpanel" aria-labelledby="settings-tab-danger" hidden={activeTab !== "danger"} className={activeTab === "danger" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Экспорт данных" subtitle="Скачать проекты, карточки и данные аккаунта.">
                <div className={styles.stack}>
                  <p className={styles.copy}>
                    Вы получите ZIP-архив со всеми сгенерированными карточками и данными профиля в JSON. Архив будет подготовлен в течение нескольких минут и отправлен на email.
                  </p>
                  <Button variant="darkOutline" disabled={exportMutation.isPending} onClick={() => exportMutation.mutate({})}>
                    {exportMutation.isPending ? "Отправляем..." : "Запросить экспорт"}
                  </Button>
                </div>
              </SettingsCard>

              <CardSurface theme="dark" className={styles.dangerZone}>
                <div className={styles.dangerBody}>
                  <h2 className={styles.dangerTitle}>Удалить аккаунт</h2>
                  <p className={styles.dangerText}>Это действие необратимо. Все проекты, карточки и данные будут удалены без возможности восстановления.</p>
                </div>
                <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Удалить аккаунт</Button>
              </CardSurface>

              <p className={styles.note}>Нужен только новый тариф? Перейдите в <Link href="/app">раздел тарифов</Link> без удаления аккаунта.</p>
            </section>
          </div>
        </div>
      </main>

      {deleteModalOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={closeDeleteModal}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-account-title" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon} aria-hidden="true">⚠</div>
            <h2 id="delete-account-title" className={styles.modalTitle}>Удалить аккаунт?</h2>
            <p className={styles.modalText}>Для подтверждения введите слово <strong>{deleteConfirmWord}</strong>.</p>
            <Input dark label="Подтверждение" placeholder={deleteConfirmWord} value={deleteConfirmInput} onChange={(e) => setDeleteConfirmInput(e.target.value)} />
            <div className={styles.modalActions}>
              <Button variant="darkOutline" block onClick={closeDeleteModal}>Отмена</Button>
              <Button variant="danger" block disabled={deleteConfirmInput !== deleteConfirmWord || deleteAccountMutation.isPending} onClick={() => deleteAccountMutation.mutate({ body: { confirm_word: deleteConfirmInput } })}>
                {deleteAccountMutation.isPending ? "Удаляем..." : "Удалить навсегда"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={toast.tone === "danger" ? styles.toastDotDanger : styles.toastDotSuccess} />
          <span>{toast.message}</span>
        </div>
      ) : null}
    </AppShell>
  );
}

function SettingsCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <CardSurface theme="dark" className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardSubtitle}>{subtitle}</p>
      </header>
      <div className={styles.cardBody}>{children}</div>
    </CardSurface>
  );
}

function SwitchRow({ checked, title, description, disabled, onToggle }: { checked: boolean; title: string; description: string; disabled?: boolean; onToggle: () => void }) {
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchCopy}>
        <div className={styles.listTitle}>{title}</div>
        <div className={styles.listMetaMuted}>{description}</div>
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={title} disabled={disabled} className={classNames(styles.switchControl, checked && styles.switchControlOn)} onClick={onToggle}>
        <span className={styles.switchKnob} />
      </button>
    </div>
  );
}
