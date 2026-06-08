'use client';
import '../../../styles/global.css';
import clsx from 'clsx';
import styles from './style.module.css';

export interface ToggleInputProps {
  /** The current state of the toggle */
  checked: boolean;
  /** Called when the toggle is switched, receives the new state */
  onChange?: (value: boolean) => void;
  /** Display text next to the switch */
  label: string;
  /** Optional icon (URL for an <img> tag) */
  icon?: string;
  /** Optional additional class name for the wrapper */
  className?: string;
}

export function ToggleInput({
  label,
  icon,
  checked,
  onChange,
  className,
}: ToggleInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.checked);
  }

  return (
    <label className={clsx(styles.switchItem, className)}>
      <span className={styles.label}>
        {icon && <img src={icon} alt="" />}
        {label}
      </span>
      <input
        className={styles.hiddenInput}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <span className={styles.customSwitch} />
    </label>
  );
}
