'use client';
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useLocale } from '../../../contexts/LocaleContext';
import { imagesInputLocale } from './locale';
import { TextBox } from '../../inputs/TextBox';
import { Button } from '../../Button';
import styles from './style.module.css';

interface ImagesInputProps {
  /** Mixed array of already‑uploaded URLs (strings) and newly selected Files */
  images: (string | File)[];
  onImagesChange: (newImages: (string | File)[]) => void;
  label?: string;
  allowUrls?: boolean;
  allowedFormats?: string[];
  maxImages?: number;
}

export function ImagesInput({
  images,
  onImagesChange,
  label,
  allowUrls = false,
  allowedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  maxImages,
}: ImagesInputProps) {
  const { locale, direction } = useLocale();
  const t =
    imagesInputLocale[locale as keyof typeof imagesInputLocale] ??
    imagesInputLocale.en;

  const displayLabel = label ?? t.label;

  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFull = maxImages ? images.length >= maxImages : false;
  const acceptString = allowedFormats.join(',');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let validFiles = Array.from(files).filter((file) => {
      const fileName = file.name.toLowerCase();
      return allowedFormats.some((format) =>
        fileName.endsWith(format.toLowerCase()),
      );
    });

    if (maxImages) {
      const availableSlots = maxImages - images.length;
      if (validFiles.length > availableSlots) {
        alert(t.maxLimitWarning(maxImages));
        validFiles = validFiles.slice(0, Math.max(0, availableSlots));
      }
    }

    onImagesChange([...images, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || isFull) return;
    onImagesChange([...images, trimmed]);
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const renderPreview = (img: string | File) => {
    if (typeof img === 'string') return img;
    return URL.createObjectURL(img);
  };

  return (
    <div className={styles.root} dir={direction}>
      <div className={styles.labelRow}>
        {displayLabel && <label className={styles.label}>{displayLabel}</label>}
        <span
          className={`${styles.counter} ${isFull ? styles.counterFull : ''}`}
        >
          {t.counter(images.length, maxImages)}
        </span>
      </div>

      <div className={styles.container}>
        <div className={styles.mediaActions}>
          <input
            type="file"
            multiple
            accept={acceptString}
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={handleFileChange}
            disabled={isFull}
          />

          <button
            type="button"
            className={`${styles.uploadArea} ${isFull ? styles.disabled : ''}`}
            onClick={() => !isFull && fileInputRef.current?.click()}
            disabled={isFull}
          >
            <Upload className={styles.icon} />
            <div className={styles.uploadText}>
              <span>{isFull ? t.limitReached : t.uploadFromDevice}</span>
              <small className={styles.formatHint}>
                {allowedFormats.join(' • ')}
              </small>
            </div>
          </button>

          {allowUrls && (
            <div className={styles.urlSection}>
              <div className={styles.divider}>
                <span>{t.orAddUrl}</span>
              </div>

              <div className={styles.urlInputRow}>
                <TextBox
                  placeholder={isFull ? t.urlPlaceholderFull : t.urlPlaceholder}
                  value={urlInput}
                  dir="ltr" // URLs are always LTR
                  disabled={isFull}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUrlInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className={styles.flexGrow}
                />
                <Button
                  className={styles.addUrlBtn}
                  onClick={addImageUrl}
                  disabled={isFull || !urlInput.trim()}
                >
                  {t.addUrlButton}
                </Button>
              </div>
            </div>
          )}
        </div>

        {images.length > 0 ? (
          <div className={styles.imageGrid}>
            {images.map((img, i) => (
              <div key={i} className={styles.imageCard}>
                <img
                  src={renderPreview(img)}
                  alt={`preview ${i}`}
                  className={styles.imagePreview}
                />
                <div className={styles.imageBadge}>
                  {typeof img === 'string' ? t.badgeUrl : t.badgeFile}
                </div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => removeImage(i)}
                  title="Remove"
                >
                  <X className={styles.icon} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.imageEmpty}>
            <div className={styles.emptyIconCircle}>
              <ImageIcon className={styles.icon} />
            </div>
            <p>{t.emptyTitle}</p>
            <span>{t.emptyDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
}
