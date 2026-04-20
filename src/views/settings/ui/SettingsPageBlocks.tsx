"use client";

import { Button, Input, Select } from "@/shared/ui";
import { deleteConfirmWord } from "@/views/settings/model/content";
import { useSettingsPage } from "@/views/settings/model/useSettingsPage";
import { AvatarPicker } from "./AvatarPicker";
import { SettingsCard } from "./SettingsPageParts";
import styles from "./SettingsPage.module.scss";

type SettingsPageModel = ReturnType<typeof useSettingsPage>;

type ProfileSettingsSectionProps = {
  active: boolean;
  avatarUrl: string | null | undefined;
  initials: string;
  page: SettingsPageModel;
  profileEmail: string;
  profileName: string;
};

export function ProfileSettingsSection({
  active,
  avatarUrl,
  initials,
  page,
  profileEmail,
  profileName,
}: ProfileSettingsSectionProps) {
  return (
    <section
      id="settings-panel-profile"
      role="tabpanel"
      aria-labelledby="settings-tab-profile"
      hidden={!active}
      className={active ? styles.panelActive : styles.panelHidden}
    >
      <SettingsCard
        title="Фото профиля"
        subtitle="Изображение аккаунта и публичные данные профиля."
      >
        <div className={styles.avatarRow}>
          <AvatarPicker
            initials={initials}
            src={avatarUrl}
            alt={profileName}
            isPending={page.uploadAvatarMutation.isPending}
            onUpload={page.uploadAvatar}
          />
          <div className={styles.avatarMeta}>
            <div className={styles.avatarName}>{profileName}</div>
            <div className={styles.avatarEmail}>{profileEmail}</div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Личные данные"
        subtitle="Контактные данные и информация о компании."
      >
        <div className={styles.formGrid}>
          <Input
            dark
            label="Имя и фамилия"
            value={page.profileForm.name}
            onChange={(e) => page.setProfileForm((current) => ({ ...current, name: e.target.value }))}
          />
          <Input
            dark
            label="Email"
            type="email"
            value={page.profileForm.email}
            error={page.profileEmailError ?? undefined}
            readOnly={page.emailVerified}
            controlClassName={page.emailVerified ? styles.verifiedReadonlyControl : undefined}
            endAdornment={page.emailVerified ? <span className={styles.verifiedReadonlyMark} aria-hidden="true">✓</span> : null}
            onChange={(e) => page.setProfileEmail(e.target.value)}
          />
          <Input
            dark
            label="Телефон"
            value={page.profileForm.phone}
            onChange={(e) => page.setProfileForm((current) => ({ ...current, phone: e.target.value }))}
          />
          <Input
            dark
            label="Компания"
            value={page.profileForm.company}
            onChange={(e) => page.setProfileForm((current) => ({ ...current, company: e.target.value }))}
          />
        </div>
        <div className={styles.rowActions}>
          <Button variant="darkPrimary" disabled={page.profileMutation.isPending} onClick={page.saveProfile}>
            {page.profileMutation.isPending ? "Сохраняем..." : "Сохранить изменения"}
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Настройки по умолчанию"
        subtitle="Базовые параметры новых генераций карточек."
      >
        <div className={styles.formGrid}>
          <Select
            dark
            label="Основной маркетплейс"
            value={page.defaultsForm.marketplaceId}
            onChange={(e) => page.setDefaultsForm((current) => ({ ...current, marketplaceId: e.target.value }))}
          >
            <option value="wildberries">Wildberries</option>
            <option value="ozon">Ozon</option>
            <option value="yandex_market">Яндекс Маркет</option>
          </Select>
          <Select
            dark
            label="Карточек за генерацию"
            value={page.defaultsForm.cardsPerGeneration}
            onChange={(e) => page.setDefaultsForm((current) => ({ ...current, cardsPerGeneration: e.target.value }))}
          >
            <option value="6">6 карточек</option>
            <option value="10">10 карточек</option>
            <option value="15">15 карточек</option>
          </Select>
          <Select
            dark
            label="Формат"
            value={page.defaultsForm.format}
            onChange={(e) =>
              page.setDefaultsForm((current) => ({ ...current, format: e.target.value as "png" | "jpg" | "webp" }))
            }
          >
            <option value="png">PNG</option>
            <option value="jpg">JPEG</option>
            <option value="webp">WebP</option>
          </Select>
        </div>
        <Button variant="darkOutline" disabled={page.defaultsMutation.isPending} onClick={page.saveDefaults}>
          {page.defaultsMutation.isPending ? "Сохраняем..." : "Сохранить"}
        </Button>
      </SettingsCard>
    </section>
  );
}

export function DeleteAccountModal({ page }: { page: SettingsPageModel }) {
  if (!page.deleteModalOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={page.closeDeleteModal}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalIcon} aria-hidden="true">
          !
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
          value={page.deleteConfirmInput}
          onChange={(e) => page.setDeleteConfirmInput(e.target.value)}
        />
        <div className={styles.modalActions}>
          <Button variant="darkOutline" block onClick={page.closeDeleteModal}>
            Отмена
          </Button>
          <Button
            variant="danger"
            block
            disabled={page.deleteConfirmInput !== deleteConfirmWord || page.deleteAccountMutation.isPending}
            onClick={() => page.deleteAccountMutation.mutate({ body: { confirm_word: page.deleteConfirmInput } })}
          >
            {page.deleteAccountMutation.isPending ? "Удаляем..." : "Удалить навсегда"}
          </Button>
        </div>
      </div>
    </div>
  );
}
