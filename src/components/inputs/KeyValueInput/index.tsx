'use client';
import '../../../styles/global.css';
import React, { useState, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useLocale } from '../../../contexts/LocaleContext';
import { keyValueInputLocale } from './locale';
import { TextBox } from '../TextBox';
import { Button } from '../../Button';
import styles from './style.module.css';

export interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  label?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonText?: string;
  value?: KeyValuePair[];
  defaultValue?: KeyValuePair[];
  onChange?: (pairs: KeyValuePair[]) => void;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
}

export function KeyValueInput({
  label,
  keyPlaceholder,
  valuePlaceholder,
  addButtonText,
  value: controlledValue,
  defaultValue = [],
  onChange,
  maxItems,
  disabled = false,
  className,
}: KeyValueInputProps) {
  const { locale } = useLocale();
  const t =
    keyValueInputLocale[locale as keyof typeof keyValueInputLocale] ??
    keyValueInputLocale.en;

  const displayLabel = label ?? t.label;
  const displayKeyPlaceholder = keyPlaceholder ?? t.keyPlaceholder;
  const displayValuePlaceholder = valuePlaceholder ?? t.valuePlaceholder;
  const displayAddButtonText = addButtonText ?? t.addButton;

  const [internalPairs, setInternalPairs] = useState<KeyValuePair[]>(
    () => defaultValue || [],
  );

  const isControlled = controlledValue !== undefined;
  const pairs = isControlled ? controlledValue : internalPairs;
  const isFull = maxItems !== undefined && pairs.length >= maxItems;

  const setPairs = useCallback(
    (newPairs: KeyValuePair[]) => {
      if (!isControlled) {
        setInternalPairs(newPairs);
      }
      onChange?.(newPairs);
    },
    [isControlled, onChange],
  );

  const handleAdd = () => {
    if (isFull || disabled) return;
    setPairs([...pairs, { key: '', value: '' }]);
  };

  const handleChangePair = (
    index: number,
    field: 'key' | 'value',
    val: string,
  ) => {
    const updated = pairs.map((p, i) =>
      i === index ? { ...p, [field]: val } : p,
    );
    setPairs(updated);
  };

  const handleRemove = (index: number) => {
    const updated = pairs.filter((_, i) => i !== index);
    setPairs(updated);
  };

  return (
    <div className={clsx(styles.root, className)}>
      {displayLabel && <p className={styles.label}>{displayLabel}</p>}

      {pairs.length > 0 && (
        <div className={styles.rows}>
          {pairs.map((pair, index) => (
            <div key={index} className={styles.row}>
              <TextBox
                className={styles.keyInput}
                placeholder={displayKeyPlaceholder}
                value={pair.key}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangePair(index, 'key', e.target.value)
                }
                disabled={disabled}
                aria-label="Key"
              />
              <span className={styles.separator}>:</span>
              <TextBox
                className={styles.valueInput}
                placeholder={displayValuePlaceholder}
                value={pair.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangePair(index, 'value', e.target.value)
                }
                disabled={disabled}
                aria-label="Value"
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(index)}
                disabled={disabled}
                title={t.removeLabel}
                aria-label={t.removeLabel}
              >
                <X className={styles.icon} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="normal"
        icon={Plus}
        onClick={handleAdd}
        disabled={disabled || isFull}
        className={styles.addButton}
      >
        {displayAddButtonText}
      </Button>
    </div>
  );
}
