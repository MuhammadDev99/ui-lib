'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './style.module.css';

type Props = {
  label?: string;
} & ComponentPropsWithoutRef<'div'>;

export function Loader({ label = '', className, ...rest }: Props) {
  return (
    <div className={clsx(styles.root, className)} {...rest}>
      <div className={styles.spinner} />
      {label && <p className={styles.text}>{label}</p>}
    </div>
  );
}
