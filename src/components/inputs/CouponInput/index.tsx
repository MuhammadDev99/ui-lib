'use client';
import '../../../styles/global.css';
import React, { useState } from 'react';
import { Ticket, X, CheckCircle2, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useLocale } from '../../../contexts/LocaleContext';
import { couponInputLocale } from './locale';
import styles from './style.module.css';

export interface CouponInputProps<T = unknown> {
  /**
   * Async function that validates the entered code.
   * Should throw an error (with a `message` string) if the code is invalid,
   * or return the coupon data of type T when valid.
   */
  validateCoupon: (code: string) => Promise<T>;

  /** Called when a valid coupon is successfully applied */
  onApply: (coupon: T) => void;

  /** Called when the user removes the currently applied coupon */
  onRemove: () => void;

  /** The currently applied coupon, or null/undefined if none */
  appliedCoupon: T | null | undefined;

  // --- UI customization (all optional, fall back to locale) ---
  label?: string;
  placeholder?: string;
  applyButtonText?: string;
  loadingText?: string;
  successMessage?: string;
  defaultErrorMessage?: string;
  className?: string;

  /**
   * Used to extract a displayable code from the coupon object.
   * If not provided, it tries to read `(coupon as any).code`,
   * falling back to `String(coupon)`.
   */
  getCouponCode?: (coupon: T) => string;

  /**
   * Fully custom render for the applied coupon badge.
   * Overrides the default badge (which shows the code and a success message).
   */
  renderAppliedCoupon?: (coupon: T, onRemove: () => void) => React.ReactNode;
}

export function CouponInput<T = unknown>({
  validateCoupon,
  onApply,
  onRemove,
  appliedCoupon,
  label,
  placeholder,
  applyButtonText,
  loadingText,
  successMessage,
  defaultErrorMessage,
  className,
  getCouponCode,
  renderAppliedCoupon,
}: CouponInputProps<T>) {
  const { locale, direction } = useLocale();
  const t =
    couponInputLocale[locale as keyof typeof couponInputLocale] ??
    couponInputLocale.en;

  // Resolve props → fallback to locale
  const displayLabel = label ?? t.label;
  const displayPlaceholder = placeholder ?? t.placeholder;
  const displayApplyButtonText = applyButtonText ?? t.applyButtonText;
  const displayLoadingText = loadingText ?? t.loadingText;
  const displaySuccessMessage = successMessage ?? t.successMessage;
  const displayDefaultError = defaultErrorMessage ?? t.defaultErrorMessage;

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleApply = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode || isLoading) return;

    setIsLoading(true);
    setLocalError(null);

    try {
      const data = await validateCoupon(trimmedCode);
      onApply(data);
      setCode('');
    } catch (error: any) {
      setLocalError(error?.message || displayDefaultError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (localError) setLocalError(null);
  };

  const handleRemove = () => {
    setLocalError(null);
    onRemove();
  };

  const codeDisplay = React.useMemo(() => {
    if (!appliedCoupon) return '';
    if (getCouponCode) return getCouponCode(appliedCoupon);
    const anyCoupon = appliedCoupon as any;
    return typeof anyCoupon === 'object' && anyCoupon !== null
      ? anyCoupon.code || anyCoupon.id || String(appliedCoupon)
      : String(appliedCoupon);
  }, [appliedCoupon, getCouponCode]);

  return (
    <div className={clsx(styles.root, className)} dir={direction}>
      <label className={styles.label}>{displayLabel}</label>

      {!appliedCoupon ? (
        <div className={styles.container}>
          <div
            className={clsx(styles.inputWrapper, localError && styles.negative)}
          >
            <Ticket className={styles.icon} />
            <input
              type="text"
              className={styles.input}
              placeholder={displayPlaceholder}
              value={code}
              size={1}
              style={{ minWidth: 0 }}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.applyBtn}
              onClick={handleApply}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span className={styles.loadingText}>
                    {displayLoadingText}
                  </span>
                </>
              ) : (
                displayApplyButtonText
              )}
            </button>
          </div>

          {localError && <p className={styles.errorMessage}>{localError}</p>}
        </div>
      ) : (
        <div className={styles.appliedBadge}>
          {renderAppliedCoupon ? (
            renderAppliedCoupon(appliedCoupon, handleRemove)
          ) : (
            <>
              <div className={styles.badgeInfo} style={{ minWidth: 0 }}>
                <CheckCircle2 className={styles.checkIcon} />
                <div className={styles.textStack} style={{ minWidth: 0 }}>
                  <span className={styles.couponName} title={codeDisplay}>
                    {codeDisplay}
                  </span>
                  <span className={styles.successMsg}>
                    {displaySuccessMessage}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={handleRemove}
              >
                <X className={styles.closeIcon} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
