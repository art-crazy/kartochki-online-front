"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getSettingsOptions, type SettingsResponse } from "@/shared/api";
import { useAuthSession } from "@/shared/auth/ui/AuthSessionProvider";
import { classNames } from "@/shared/lib/classNames";
import { getUserInitials } from "@/shared/lib/user";
import { Button, CardSurface, Input } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { settingsTabs, type SettingsTabId } from "@/views/settings/model/content";
import { useSettingsPage } from "@/views/settings/model/useSettingsPage";
import { DeleteAccountModal, ProfileSettingsSection } from "./SettingsPageBlocks";
import { SettingsCard, SettingsStatus } from "./SettingsPageParts";
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
  const initials = getUserInitials(settings.profile.name, settings.profile.email);
  const profileEmail = settings.profile.email ?? "Email не указан";

  return (
    <AppShell title="Настройки" subtitle="Профиль, безопасность, уведомления и интеграции" activeKey="settings">
      <main className={styles.page}>
        <div className={styles.layout}>
          <SettingsTabs activeTab={page.activeTab} onChange={page.setActiveTab} />

          <div className={styles.panels}>
            <ProfileSettingsSection
              active={page.activeTab === "profile"}
              avatarUrl={user?.avatar_url}
              initials={initials}
              page={page}
              profileEmail={profileEmail}
              profileName={settings.profile.name}
            />

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

            {/* TODO: вернуть вкладку и панель уведомлений после согласования отдельного UX/UI-флоу.
            <SettingsNotificationsSection active={page.activeTab === "notifications"} page={page} profileEmail={profileEmail} />
            */}

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

      <DeleteAccountModal page={page} />

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
