'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react'; // 👈 replaced inline SVG
import { useLocale } from '../../contexts/LocaleContext';
import { errorDisplayLocale } from './locale';
import styles from './style.module.css';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title,
  message,
  error,
  reset,
  className,
}: ErrorDisplayProps) {
  const { locale } = useLocale();
  const t =
    errorDisplayLocale[locale as keyof typeof errorDisplayLocale] ??
    errorDisplayLocale.en;
  const [showDetails, setShowDetails] = useState(false);

  const displayMessage = message || error?.message || t.fallbackMessage;
  const displayTitle = title || t.title;

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.card} role="alert">
        <div className={styles.iconCircle}>
          <AlertCircle className={styles.errorIcon} />
        </div>

        <h1 className={styles.title}>{displayTitle}</h1>
        <p className={styles.message}>{displayMessage}</p>

        <div className={styles.actions}>
          {reset && (
            <button onClick={() => reset()} className={styles.retryButton}>
              {t.retry}
            </button>
          )}

          {(error?.stack || error?.digest) && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={styles.detailsToggle}
            >
              {showDetails ? t.hideDetails : t.viewDetails}
            </button>
          )}
        </div>

        {showDetails && (
          <div className={styles.detailsArea}>
            {error?.digest && (
              <div className={styles.digestRow}>
                <span>{t.digestId}</span>
                <code>{error.digest}</code>
              </div>
            )}
            {error?.stack && (
              <pre className={styles.stackTrace}>{error.stack}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
