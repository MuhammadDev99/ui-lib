'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes, ElementType } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import { buttonLocale } from './locale';
import styles from './style.module.css';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  variant?: 'normal' | 'primary' | 'negative';
  loading?: boolean;
  icon?: ElementType;
  iconRotationDeg?: number;
  flipIconOrder?: boolean;
  href?: string;
  htmlType?: 'submit' | 'button' | 'reset';
}

export function Button({
  className,
  children,
  variant = 'normal',
  htmlType = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRotationDeg = 0,
  flipIconOrder = false,
  onClick,
  href,
  ...rest
}: ButtonProps) {
  const { locale } = useLocale();
  const t =
    buttonLocale[locale as keyof typeof buttonLocale] ?? buttonLocale.en;
  // ── Loading content ──
  const content = loading ? (
    <>
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.loadingText}>{children ?? t.loading ?? ''}</span>
    </>
  ) : (
    children
  );

  const classes = clsx(
    styles.container,
    className,
    styles[variant],
    (disabled || loading) && styles.disabled,
    loading && styles.loading,
  );

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  const iconElement =
    Icon && !loading ? (
      <Icon
        className={styles.icon}
        style={{ transform: `rotate(${iconRotationDeg}deg)` }}
      />
    ) : null;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {flipIconOrder && content}
        {iconElement}
        {!flipIconOrder && content}
      </a>
    );
  }

  return (
    <button
      type={htmlType}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
    >
      {flipIconOrder && content}
      {iconElement}
      {!flipIconOrder && content}
    </button>
  );
}
