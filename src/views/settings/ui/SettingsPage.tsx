"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { Avatar, Badge, Button, CardSurface, Input, Select } from "@/shared/ui";
import {
  apiKeyMask,
  connectedAccounts,
  deleteConfirmWord,
  notificationItems,
  profileData,
  profileDefaults,
  securitySessions,
  settingsTabs,
  type SettingsTabId,
} from "@/views/settings/model/content";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./SettingsPage.module.scss";

type ToastState = {
  message: string;
  tone: "success" | "danger";
};

const defaultToggleState = Object.fromEntries(
  [...notificationItems.email, ...notificationItems.security].map((item) => [item.key, item.defaultChecked]),
) as Record<string, boolean>;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");
  const [toggles, setToggles] = useState<Record<string, boolean>>(defaultToggleState);
  const [showApiKey, setShowApiKey] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    company: profileData.company,
  });
  const [defaultsForm, setDefaultsForm] = useState({
    marketplace: profileDefaults.marketplace,
    cardsPerGeneration: profileDefaults.cardsPerGeneration,
    format: profileDefaults.format,
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!profileSaved) {
      return undefined;
    }

    const timer = window.setTimeout(() => setProfileSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [profileSaved]);

  function showToast(message: string, tone: ToastState["tone"] = "success") {
    setToast({ message, tone });
  }

  function toggleSetting(key: string) {
    const nextValue = !toggles[key];

    setToggles((current) => ({
      ...current,
      [key]: nextValue,
    }));
    showToast(nextValue ? "Настройка включена" : "Настройка отключена");
  }

  function saveProfile() {
    setProfileSaved(true);
    showToast("Профиль сохранён");
  }

  function saveDefaults() {
    showToast("Настройки по умолчанию сохранены");
  }

  function changePassword() {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      showToast("Заполните все поля", "danger");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      showToast("Пароли не совпадают", "danger");
      return;
    }

    if (passwordForm.next.length < 8) {
      showToast("Минимум 8 символов", "danger");
      return;
    }

    setPasswordForm({
      current: "",
      next: "",
      confirm: "",
    });
    showToast("Пароль изменён");
  }

  async function copyApiKey() {
    try {
      await navigator.clipboard.writeText(apiKeyMask);
      showToast("API-ключ скопирован");
    } catch {
      showToast("Не удалось скопировать ключ", "danger");
    }
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeleteConfirm("");
  }

  function handleDelete() {
    if (deleteConfirm !== deleteConfirmWord) {
      return;
    }

    closeDeleteModal();
    showToast("Запрос на удаление аккаунта принят", "danger");
  }

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
                <span className={styles.tabIcon} aria-hidden="true">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.panels}>
            <section
              id="settings-panel-profile"
              role="tabpanel"
              aria-labelledby="settings-tab-profile"
              hidden={activeTab !== "profile"}
              className={activeTab === "profile" ? styles.panelActive : styles.panelHidden}
            >
              <SettingsCard title="Фото профиля" subtitle="Изображение аккаунта и публичные данные профиля.">
                <div className={styles.avatarRow}>
                  <div className={styles.avatarWrap}>
                    <Avatar initials={profileData.initials} size="xl" />
                    <span className={styles.avatarEdit} aria-hidden="true">
                      ✎
                    </span>
                  </div>

                  <div className={styles.avatarMeta}>
                    <div className={styles.avatarName}>{profileData.name}</div>
                    <div className={styles.avatarEmail}>{profileData.email}</div>
                    <div className={styles.avatarActions}>
                      <Button variant="darkPrimary" size="sm" onClick={() => showToast("Загрузка аватара будет подключена позже")}>
                        Загрузить фото
                      </Button>
                      <Button variant="darkOutline" size="sm" onClick={() => showToast("Аватар удалён")}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard title="Личные данные" subtitle="Контактные данные и информация о компании.">
                <div className={styles.formGrid}>
                  <Input
                    dark
                    label="Имя и фамилия"
                    value={profileForm.name}
                    onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                  />
                  <Input
                    dark
                    label="Email"
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                  />
                  <Input
                    dark
                    label="Телефон"
                    value={profileForm.phone}
                    onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                  <Input
                    dark
                    label="Компания"
                    value={profileForm.company}
                    onChange={(event) => setProfileForm((current) => ({ ...current, company: event.target.value }))}
                  />
                </div>

                <div className={styles.rowActions}>
                  <Button variant="darkPrimary" onClick={saveProfile}>
                    Сохранить изменения
                  </Button>
                  {profileSaved ? <Badge tone="success">Сохранено</Badge> : null}
                </div>
              </SettingsCard>

              <SettingsCard title="Настройки по умолчанию" subtitle="Базовые параметры новых генераций карточек.">
                <div className={styles.formGrid}>
                  <Select
                    dark
                    label="Основной маркетплейс"
                    value={defaultsForm.marketplace}
                    onChange={(event) => setDefaultsForm((current) => ({ ...current, marketplace: event.target.value }))}
                  >
                    <option value="wildberries">Wildberries</option>
                    <option value="ozon">Ozon</option>
                    <option value="ymarket">Яндекс Маркет</option>
                  </Select>
                  <Select
                    dark
                    label="Карточек за генерацию"
                    value={defaultsForm.cardsPerGeneration}
                    onChange={(event) => setDefaultsForm((current) => ({ ...current, cardsPerGeneration: event.target.value }))}
                  >
                    <option value="6">6 карточек</option>
                    <option value="10">10 карточек</option>
                    <option value="15">15 карточек</option>
                  </Select>
                  <Select
                    dark
                    label="Формат"
                    value={defaultsForm.format}
                    onChange={(event) => setDefaultsForm((current) => ({ ...current, format: event.target.value }))}
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WebP</option>
                  </Select>
                </div>

                <Button variant="darkOutline" onClick={saveDefaults}>
                  Сохранить по умолчанию
                </Button>
              </SettingsCard>
            </section>

            <section
              id="settings-panel-security"
              role="tabpanel"
              aria-labelledby="settings-tab-security"
              hidden={activeTab !== "security"}
              className={activeTab === "security" ? styles.panelActive : styles.panelHidden}
            >
              <SettingsCard title="Смена пароля" subtitle="Последнее изменение: никогда.">
                <div className={styles.stack}>
                  <Input
                    dark
                    label="Текущий пароль"
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.current}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))}
                  />
                  <Input
                    dark
                    label="Новый пароль"
                    type="password"
                    placeholder="Минимум 8 символов"
                    value={passwordForm.next}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))}
                  />
                  <Input
                    dark
                    label="Повторите новый пароль"
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.confirm}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))}
                  />
                </div>

                <Button variant="darkPrimary" onClick={changePassword}>
                  Изменить пароль
                </Button>
              </SettingsCard>

              <SettingsCard title="Двухфакторная аутентификация" subtitle="Дополнительная защита аккаунта при входе.">
                <div className={styles.stack}>
                  {notificationItems.security.map((item) => (
                    <SwitchRow
                      key={item.key}
                      checked={toggles[item.key]}
                      title={item.title}
                      description={item.description}
                      onToggle={() => toggleSetting(item.key)}
                    />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Активные сессии" subtitle="Устройства с активным входом в аккаунт.">
                <div className={styles.stack}>
                  {securitySessions.map((session) => (
                    <div key={session.id} className={styles.listRow}>
                      <div className={styles.listIcon} aria-hidden="true">
                        {session.icon}
                      </div>
                      <div className={styles.listBody}>
                        <div className={styles.listTitle}>{session.name}</div>
                        <div className={session.tone === "success" ? styles.listMetaSuccess : styles.listMetaMuted}>
                          {session.status}
                        </div>
                      </div>
                      {session.actionLabel ? (
                        <Button variant="darkOutline" size="sm" onClick={() => showToast("Сессия завершена")}>
                          {session.actionLabel}
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <Button variant="danger" onClick={() => showToast("Остальные сессии завершены")}>
                  Завершить все остальные сессии
                </Button>
              </SettingsCard>
            </section>

            <section
              id="settings-panel-notifications"
              role="tabpanel"
              aria-labelledby="settings-tab-notifications"
              hidden={activeTab !== "notifications"}
              className={activeTab === "notifications" ? styles.panelActive : styles.panelHidden}
            >
              <SettingsCard title="Email-уведомления" subtitle={`На адрес ${profileForm.email}.`}>
                <div className={styles.stack}>
                  {notificationItems.email.map((item) => (
                    <SwitchRow
                      key={item.key}
                      checked={toggles[item.key]}
                      title={item.title}
                      description={item.description}
                      onToggle={() => toggleSetting(item.key)}
                    />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Telegram-уведомления" subtitle="Мгновенные оповещения в мессенджере.">
                <div className={styles.listRow}>
                  <div className={styles.listBody}>
                    <div className={styles.listTitle}>Подключить Telegram-бота</div>
                    <div className={styles.listMetaMuted}>Уведомления о готовых карточках и событиях аккаунта.</div>
                  </div>
                  <Button variant="darkOutline" size="sm" onClick={() => showToast("Открываем Telegram-бота...")}>
                    Подключить
                  </Button>
                </div>
              </SettingsCard>
            </section>

            <section
              id="settings-panel-integrations"
              role="tabpanel"
              aria-labelledby="settings-tab-integrations"
              hidden={activeTab !== "integrations"}
              className={activeTab === "integrations" ? styles.panelActive : styles.panelHidden}
            >
              <SettingsCard title="Подключённые аккаунты" subtitle="Для быстрого входа и внешних интеграций.">
                <div className={styles.stack}>
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className={styles.listRow}>
                      <div className={styles.listIcon} aria-hidden="true">
                        {account.name === "Google" ? "G" : "✈"}
                      </div>
                      <div className={styles.listBody}>
                        <div className={styles.listTitle}>{account.name}</div>
                        <div className={account.connected ? styles.listMetaSuccess : styles.listMetaMuted}>
                          {account.status}
                        </div>
                      </div>
                      <Button
                        variant="darkOutline"
                        size="sm"
                        onClick={() =>
                          showToast(account.connected ? "Аккаунт отключён" : "Открываем подключение Telegram...")
                        }
                      >
                        {account.actionLabel}
                      </Button>
                    </div>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="API-ключ" subtitle="Для интеграции с вашими системами на тарифе Бизнес.">
                <div className={styles.stack}>
                  <div className={styles.apiRow}>
                    <Input dark label="Ваш API-ключ" readOnly type={showApiKey ? "text" : "password"} value={apiKeyMask} />
                    <div className={styles.apiActions}>
                      <Button variant="darkOutline" onClick={() => setShowApiKey((current) => !current)}>
                        {showApiKey ? "Скрыть" : "Показать"}
                      </Button>
                      <Button variant="darkOutline" onClick={() => void copyApiKey()}>
                        Копировать
                      </Button>
                    </div>
                  </div>

                  <Button variant="danger" onClick={() => showToast("Ключ перевыпущен")}>
                    Перевыпустить ключ
                  </Button>
                </div>
              </SettingsCard>
            </section>

            <section
              id="settings-panel-danger"
              role="tabpanel"
              aria-labelledby="settings-tab-danger"
              hidden={activeTab !== "danger"}
              className={activeTab === "danger" ? styles.panelActive : styles.panelHidden}
            >
              <SettingsCard title="Экспорт данных" subtitle="Скачать проекты, карточки и данные аккаунта.">
                <div className={styles.stack}>
                  <p className={styles.copy}>
                    Вы получите ZIP-архив со всеми сгенерированными карточками и данными профиля в JSON. Архив будет
                    подготовлен в течение нескольких минут и отправлен на email.
                  </p>
                  <Button variant="darkOutline" onClick={() => showToast("Запрос на экспорт отправлен")}>
                    Запросить экспорт
                  </Button>
                </div>
              </SettingsCard>

              <CardSurface theme="dark" className={styles.dangerZone}>
                <div className={styles.dangerBody}>
                  <h2 className={styles.dangerTitle}>Удалить аккаунт</h2>
                  <p className={styles.dangerText}>
                    Это действие необратимо. Все проекты, карточки и данные будут удалены без возможности
                    восстановления.
                  </p>
                </div>
                <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                  Удалить аккаунт
                </Button>
              </CardSurface>

              <p className={styles.note}>
                Нужен только новый тариф? Перейдите в <Link href="/app">раздел тарифов</Link> без удаления аккаунта.
              </p>
            </section>
          </div>
        </div>
      </main>

      {deleteModalOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={closeDeleteModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalIcon} aria-hidden="true">
              ⚠
            </div>
            <h2 id="delete-account-title" className={styles.modalTitle}>
              Удалить аккаунт?
            </h2>
            <p className={styles.modalText}>
              Для подтверждения введите слово <strong>{deleteConfirmWord}</strong>.
            </p>
            <Input
              dark
              label="Подтверждение"
              placeholder={deleteConfirmWord}
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
            />
            <div className={styles.modalActions}>
              <Button variant="darkOutline" block onClick={closeDeleteModal}>
                Отмена
              </Button>
              <Button variant="danger" block disabled={deleteConfirm !== deleteConfirmWord} onClick={handleDelete}>
                Удалить навсегда
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

function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
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

function SwitchRow({
  checked,
  title,
  description,
  onToggle,
}: {
  checked: boolean;
  title: string;
  description: string;
  onToggle: () => void;
}) {
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchCopy}>
        <div className={styles.listTitle}>{title}</div>
        <div className={styles.listMetaMuted}>{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={classNames(styles.switchControl, checked && styles.switchControlOn)}
        onClick={onToggle}
      >
        <span className={styles.switchKnob} />
      </button>
    </div>
  );
}
