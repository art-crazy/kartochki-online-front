"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getSettingsOptions, type SettingsResponse } from "@/shared/api";
import { useAuthSession } from "@/shared/auth/ui/AuthSessionProvider";
import { classNames } from "@/shared/lib/classNames";
import { getUserInitials } from "@/shared/lib/user";
import { Avatar, Button, CardSurface, Input, Select } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import {
  deleteConfirmWord,
  notificationLabels,
  settingsTabs,
  type SettingsTabId,
} from "@/views/settings/model/content";
import { useSettingsPage } from "@/views/settings/model/useSettingsPage";
import { SettingsCard, SettingsStatus, SwitchRow } from "./SettingsPageParts";
import styles from "./SettingsPage.module.scss";

export function SettingsPage() {
  const { data: settings, isError, isPending, refetch } = useQuery(getSettingsOptions());

  if (isPending) {
    return (
      <AppShell title="Настройки" subtitle="Загружаем данные профиля" activeKey="settings">
        <main className={styles.page}>
          <SettingsStatus title="Загружаем настройки" description="Получаем профиль и сессии." />
        </main>
      </AppShell>
    );
  }

  if (isError || !settings) {
    return (
      <AppShell title="Настройки" subtitle="Не удалось получить данные" activeKey="settings">
        <main className={styles.page}>
          <SettingsStatus
            title="Настройки не загрузились"
            description="Проверьте API и повторите запрос."
            action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
          />
        </main>
      </AppShell>
    );
  }

  return <SettingsPageContent settings={settings} />;
}

function SettingsPageContent({ settings }: { settings: SettingsResponse }) {
  const { user } = useAuthSession();
  const page = useSettingsPage(settings);
  const emailNotifications = Object.entries(notificationLabels).filter(([, v]) => v.group === "email");
  const securityNotifications = Object.entries(notificationLabels).filter(([, v]) => v.group === "security");
  const initials = getUserInitials(settings.profile.name, settings.profile.email);
  const profileEmail = settings.profile.email ?? "Email не указан";

  return (
    <AppShell title="Настройки" subtitle="Профиль, безопасность, уведомления и интеграции" activeKey="settings">
      <main className={styles.page}>
        <div className={styles.layout}>
          <SettingsTabs activeTab={page.activeTab} onChange={page.setActiveTab} />

          <div className={styles.panels}>
            <section id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" hidden={page.activeTab !== "profile"} className={page.activeTab === "profile" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Фото профиля" subtitle="Изображение аккаунта и публичные данные профиля.">
                <div className={styles.avatarRow}>
                  <div className={styles.avatarWrap}>
                    <Avatar initials={initials} src={user?.avatar_url} alt={settings.profile.name} size="xl" />
                    <span className={styles.avatarEdit} aria-hidden="true">✎</span>
                  </div>
                  <div className={styles.avatarMeta}>
                    <div className={styles.avatarName}>{settings.profile.name}</div>
                    <div className={styles.avatarEmail}>{profileEmail}</div>
                    <div className={styles.avatarActions}>
                      <Button variant="darkPrimary" size="sm" onClick={() => page.showToast("Загрузка аватара будет подключена позже")}>Загрузить фото</Button>
                      <Button variant="darkOutline" size="sm" onClick={() => page.showToast("Аватар удален")}>Удалить</Button>
                    </div>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard title="Личные данные" subtitle="Контактные данные и информация о компании.">
                <div className={styles.formGrid}>
                  <Input dark label="Имя и фамилия" value={page.profileForm.name} onChange={(e) => page.setProfileForm((c) => ({ ...c, name: e.target.value }))} />
                  <Input dark label="Email" type="email" value={page.profileForm.email} onChange={(e) => page.setProfileForm((c) => ({ ...c, email: e.target.value }))} />
                  <Input dark label="Телефон" value={page.profileForm.phone} onChange={(e) => page.setProfileForm((c) => ({ ...c, phone: e.target.value }))} />
                  <Input dark label="Компания" value={page.profileForm.company} onChange={(e) => page.setProfileForm((c) => ({ ...c, company: e.target.value }))} />
                </div>
                <div className={styles.rowActions}>
                  <Button variant="darkPrimary" disabled={page.profileMutation.isPending} onClick={page.saveProfile}>
                    {page.profileMutation.isPending ? "Сохраняем..." : "Сохранить изменения"}
                  </Button>
                </div>
              </SettingsCard>

              <SettingsCard title="Настройки по умолчанию" subtitle="Базовые параметры новых генераций карточек.">
                <div className={styles.formGrid}>
                  <Select dark label="Основной маркетплейс" value={page.defaultsForm.marketplaceId} onChange={(e) => page.setDefaultsForm((c) => ({ ...c, marketplaceId: e.target.value }))}>
                    <option value="wildberries">Wildberries</option>
                    <option value="ozon">Ozon</option>
                    <option value="yandex_market">Яндекс Маркет</option>
                  </Select>
                  <Select dark label="Карточек за генерацию" value={page.defaultsForm.cardsPerGeneration} onChange={(e) => page.setDefaultsForm((c) => ({ ...c, cardsPerGeneration: e.target.value }))}>
                    <option value="6">6 карточек</option>
                    <option value="10">10 карточек</option>
                    <option value="15">15 карточек</option>
                  </Select>
                  <Select dark label="Формат" value={page.defaultsForm.format} onChange={(e) => page.setDefaultsForm((c) => ({ ...c, format: e.target.value as "png" | "jpg" | "webp" }))}>
                    <option value="png">PNG</option>
                    <option value="jpg">JPEG</option>
                    <option value="webp">WebP</option>
                  </Select>
                </div>
                <Button variant="darkOutline" disabled={page.defaultsMutation.isPending} onClick={page.saveDefaults}>
                  {page.defaultsMutation.isPending ? "Сохраняем..." : "Сохранить по умолчанию"}
                </Button>
              </SettingsCard>
            </section>

            <section id="settings-panel-security" role="tabpanel" aria-labelledby="settings-tab-security" hidden={page.activeTab !== "security"} className={page.activeTab === "security" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Смена пароля" subtitle="Последнее изменение: никогда.">
                <div className={styles.stack}>
                  <Input dark label="Текущий пароль" type="password" placeholder="••••••••" value={page.passwordForm.current} onChange={(e) => page.setPasswordForm((c) => ({ ...c, current: e.target.value }))} />
                  <Input dark label="Новый пароль" type="password" placeholder="Минимум 8 символов" value={page.passwordForm.next} onChange={(e) => page.setPasswordForm((c) => ({ ...c, next: e.target.value }))} />
                  <Input dark label="Повторите новый пароль" type="password" placeholder="••••••••" value={page.passwordForm.confirm} onChange={(e) => page.setPasswordForm((c) => ({ ...c, confirm: e.target.value }))} />
                </div>
                <Button variant="darkPrimary" disabled={page.passwordMutation.isPending} onClick={page.changePassword}>
                  {page.passwordMutation.isPending ? "Сохраняем..." : "Изменить пароль"}
                </Button>
              </SettingsCard>

              <SettingsCard title="Двухфакторная аутентификация" subtitle="Дополнительная защита аккаунта при входе.">
                <div className={styles.stack}>
                  {securityNotifications.map(([key, meta]) => (
                    <SwitchRow key={key} checked={page.notifications[key] ?? false} title={meta.title} description={meta.description} disabled={page.notificationsMutation.isPending} onToggle={() => page.toggleNotification(key)} />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Активные сессии" subtitle="Устройства с активным входом в аккаунт.">
                <div className={styles.stack}>
                  {page.sessions.map((session) => (
                    <div key={session.id} className={styles.listRow}>
                      <div className={styles.listIcon} aria-hidden="true">{session.platform.toLowerCase().includes("mobile") ? "▣" : "▤"}</div>
                      <div className={styles.listBody}>
                        <div className={styles.listTitle}>{session.device} · {session.platform}</div>
                        <div className={session.isCurrent ? styles.listMetaSuccess : styles.listMetaMuted}>
                          {session.isCurrent ? `Текущая сессия${session.location ? ` · ${session.location}` : ""}` : session.location}
                        </div>
                      </div>
                      {session.canRevoke ? <Button variant="darkOutline" size="sm" disabled={page.sessionMutation.isPending} onClick={() => page.sessionMutation.mutate({ path: { id: session.id } })}>Завершить</Button> : null}
                    </div>
                  ))}
                  {page.sessions.length === 0 ? <p className={styles.listMetaMuted}>Нет активных сессий</p> : null}
                </div>
              </SettingsCard>
            </section>

            <section id="settings-panel-notifications" role="tabpanel" aria-labelledby="settings-tab-notifications" hidden={page.activeTab !== "notifications"} className={page.activeTab === "notifications" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Email-уведомления" subtitle={`На адрес ${profileEmail}.`}>
                <div className={styles.stack}>
                  {emailNotifications.map(([key, meta]) => (
                    <SwitchRow key={key} checked={page.notifications[key] ?? false} title={meta.title} description={meta.description} disabled={page.notificationsMutation.isPending} onToggle={() => page.toggleNotification(key)} />
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Telegram-уведомления" subtitle="Мгновенные оповещения в мессенджере.">
                <div className={styles.listRow}>
                  <div className={styles.listBody}>
                    <div className={styles.listTitle}>Подключить Telegram-бота</div>
                    <div className={styles.listMetaMuted}>Уведомления о готовых карточках и событиях аккаунта.</div>
                  </div>
                  <Button variant="darkOutline" size="sm" onClick={() => page.showToast("Открываем Telegram-бота...")}>Подключить</Button>
                </div>
              </SettingsCard>
            </section>

            <section id="settings-panel-danger" role="tabpanel" aria-labelledby="settings-tab-danger" hidden={page.activeTab !== "danger"} className={page.activeTab === "danger" ? styles.panelActive : styles.panelHidden}>
              <SettingsCard title="Экспорт данных" subtitle="Скачать проекты, карточки и данные аккаунта.">
                <div className={styles.stack}>
                  <p className={styles.copy}>Вы получите ZIP-архив с материалами и данными профиля. Архив будет подготовлен и отправлен на email.</p>
                  <Button variant="darkOutline" disabled={page.exportMutation.isPending} onClick={() => page.exportMutation.mutate({})}>
                    {page.exportMutation.isPending ? "Отправляем..." : "Запросить экспорт"}
                  </Button>
                </div>
              </SettingsCard>

              <CardSurface theme="dark" className={styles.dangerZone}>
                <div className={styles.dangerBody}>
                  <h2 className={styles.dangerTitle}>Удалить аккаунт</h2>
                  <p className={styles.dangerText}>Действие необратимо. Проекты, карточки и данные будут удалены без возможности восстановления.</p>
                </div>
                <Button variant="danger" onClick={() => page.setDeleteModalOpen(true)}>Удалить аккаунт</Button>
              </CardSurface>

              <p className={styles.note}>Нужен только новый тариф? Перейдите в <Link href="/app">раздел тарифов</Link> без удаления аккаунта.</p>
            </section>
          </div>
        </div>
      </main>

      {page.deleteModalOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={page.closeDeleteModal}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-account-title" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon} aria-hidden="true">!</div>
            <h2 id="delete-account-title" className={styles.modalTitle}>Удалить аккаунт?</h2>
            <p className={styles.modalText}>Для подтверждения введите слово <strong>{deleteConfirmWord}</strong>.</p>
            <Input dark label="Подтверждение" placeholder={deleteConfirmWord} value={page.deleteConfirmInput} onChange={(e) => page.setDeleteConfirmInput(e.target.value)} />
            <div className={styles.modalActions}>
              <Button variant="darkOutline" block onClick={page.closeDeleteModal}>Отмена</Button>
              <Button variant="danger" block disabled={page.deleteConfirmInput !== deleteConfirmWord || page.deleteAccountMutation.isPending} onClick={() => page.deleteAccountMutation.mutate({ body: { confirm_word: page.deleteConfirmInput } })}>
                {page.deleteAccountMutation.isPending ? "Удаляем..." : "Удалить навсегда"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {page.toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          <span className={page.toast.tone === "danger" ? styles.toastDotDanger : styles.toastDotSuccess} />
          <span>{page.toast.message}</span>
        </div>
      ) : null}
    </AppShell>
  );
}

function SettingsTabs({ activeTab, onChange }: { activeTab: SettingsTabId; onChange: (tab: SettingsTabId) => void }) {
  return (
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
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
