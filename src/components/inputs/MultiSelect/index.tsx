'use client';
import '../../../styles/global.css';
import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './style.module.css';

type Props<T extends string | number> = {
  title?: string;
  items: { label: string; value: T; icon?: React.ElementType }[];
  value?: T; // controlled value
  onChange?: (value: T) => void;
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange'>;

export function MultiSelect<T extends string | number>({
  title,
  items,
  value: controlledValue,
  onChange,
  className,
  ...rest
}: Props<T>) {
  return (
    <div className={clsx(styles.root, className)} {...rest}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.items}>
        {items.map(({ label, value: itemValue, icon: Icon }) => (
          <div
            key={itemValue}
            className={clsx(
              styles.item,
              controlledValue === itemValue && styles.selected,
            )}
            onClick={() => onChange?.(itemValue)}
            role="button"
            tabIndex={0}
          >
            {Icon && <Icon className={styles.icon} />}
            <p className={styles.label}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
