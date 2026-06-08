'use client';
import '../../../styles/global.css';
import styles from './style.module.css';

export interface RadioInputProps {
  name: string;
  label: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
  onClick?: () => void;
  className?: string;
}

export function RadioInput({
  label,
  checked,
  name,
  onChange,
  onClick,
  className,
}: RadioInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.checked);
  }

  return (
    <label
      className={`${styles.radioItem} ${className ?? ''}`}
      onClick={() => onClick?.()}
    >
      <input
        className={styles.hiddenInput}
        type="radio"
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <span className={styles.customRadio} />
      <span>{label}</span>
    </label>
  );
}
