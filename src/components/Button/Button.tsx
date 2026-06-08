import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'normal' | 'primary';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ variant = 'normal', children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
