"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Avatar } from "@/shared/ui";
import { AvatarCropModal } from "./AvatarCropModal";
import styles from "./AvatarPicker.module.scss";

type Props = {
  initials: string;
  src?: string | null;
  alt?: string;
  isPending: boolean;
  onUpload: (file: File) => void;
};

export function AvatarPicker({ initials, src, alt, isPending, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  }

  function handleConfirm(file: File) {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    onUpload(file);
  }

  function handleClose() {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={openPicker}
        disabled={isPending}
        aria-label="Изменить фото профиля"
      >
        <Avatar initials={initials} src={src} alt={alt} size="xl" />
        <span className={styles.editBadge} aria-hidden="true">✎</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={handleFileChange}
      />

      {imageSrc ? (
        <AvatarCropModal imageSrc={imageSrc} onConfirm={handleConfirm} onClose={handleClose} />
      ) : null}
    </>
  );
}
