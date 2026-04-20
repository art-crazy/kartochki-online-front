"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/shared/ui";
import { cropImageToFile, type CropArea } from "@/shared/lib/cropImage";
import styles from "./AvatarCropModal.module.scss";

type Props = {
  imageSrc: string;
  onConfirm: (file: File) => void;
  onClose: () => void;
};

export function AvatarCropModal({ imageSrc, onConfirm, onClose }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);
  const [processing, setProcessing] = useState(false);

  function onCropComplete(_: unknown, croppedAreaPixels: CropArea) {
    setCroppedArea(croppedAreaPixels);
  }

  async function handleConfirm() {
    if (!croppedArea || processing) return;
    setProcessing(true);
    try {
      const file = await cropImageToFile(imageSrc, croppedArea);
      onConfirm(file);
    } catch {
      setProcessing(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Обрезка фото">
        <div className={styles.cropArea}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            objectFit="horizontal-cover"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <input
          className={styles.zoomSlider}
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Масштаб"
        />
        <div className={styles.actions}>
          <Button variant="darkOutline" onClick={onClose}>Отмена</Button>
          <Button variant="darkPrimary" loading={processing} onClick={handleConfirm}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
}
