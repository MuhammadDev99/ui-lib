'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import styles from './style.module.css';

export interface PriceProps {
  /** The base price (before discount) */
  value: number;
  /** ISO 4217 currency code (e.g., 'SAR', 'USD', 'EUR') */
  currency?: string;
  /** Locale for formatting (defaults to browser locale) */
  locale?: string;
  /** Discount percentage (0–100). If provided, original price is shown struck through. */
  discount?: number;
  /** Additional class name */
  className?: string;
}

export function Price({
  value,
  currency,
  locale,
  discount,
  className,
}: PriceProps) {
  const formatNumber = (amount: number) => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const hasDiscount = discount != null && discount > 0;
  const discountedValue = hasDiscount
    ? value * ((100 - discount) / 100)
    : value;

  return (
    <span
      className={clsx(styles.container, className)}
      aria-label={
        hasDiscount
          ? `Original price ${formatNumber(value)}, now ${formatNumber(discountedValue)}`
          : formatNumber(value)
      }
    >
      {hasDiscount && (
        <span className={styles.originalPrice} aria-hidden="true">
          {formatNumber(value)}
        </span>
      )}
      <span
        className={clsx(styles.currentPrice, hasDiscount && styles.discounted)}
      >
        {formatNumber(discountedValue)}
      </span>
    </span>
  );
}
