'use client';
import '../../../styles/global.css';
import { useFormImperativeHandle } from '../../../hooks/useFormImperativeHandle';
import { FormElementRef } from '../../../types';
import clsx from 'clsx';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './style.module.css';

export type SelectOption<T extends string | number> = {
  display: string;
  value: T;
};
export type SelectGroup<T extends string | number> = {
  groupLabel: string;
  items: SelectOption<T>[];
};
export type OptionItem<T extends string | number> =
  | SelectOption<T>
  | SelectGroup<T>;

interface SelectBoxProps<T extends string | number> extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ElementType;
  tooltip?: string;
  placeholder?: string;
  options?: OptionItem<T>[];
  validation?: (value: string) => string | undefined | null;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  required?: boolean;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
}

const SelectBoxInner = <T extends string | number>(
  {
    label,
    error: externalError,
    helperText,
    className,
    required,
    icon: Icon,
    tooltip,
    disabled,
    options = [],
    placeholder,
    validation,
    onChange,
    defaultValue,
    value: controlledValue,
    direction = 'vertical',
    ...rest
  }: SelectBoxProps<T>,
  ref: React.ForwardedRef<FormElementRef>,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);

  // --- DERIVED STATE ---
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
    defaultValue,
  );
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  // --- REUSABLE LOGIC ---
  const { internalError, setInternalError } = useFormImperativeHandle({
    ref,
    containerRef,
    validation,
    getValue: () => (selectedValue ?? '').toString(),
    onFocus: () => handleToggle(true),
  });

  const currentError = internalError || externalError;
  const hasError = !!currentError;

  const flatOptions = useMemo(() => {
    const items: SelectOption<T>[] = [];
    options.forEach((item) => {
      if ('items' in item) items.push(...item.items);
      else items.push(item);
    });
    return items;
  }, [options]);

  const selectedDisplay = useMemo(() => {
    return (
      flatOptions.find((opt) => opt.value === selectedValue)?.display ||
      placeholder
    );
  }, [flatOptions, selectedValue, placeholder]);

  const handleToggle = (forceOpen?: boolean) => {
    if (disabled) return;
    const nextState = forceOpen !== undefined ? forceOpen : !isOpen;
    if (nextState && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 250;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow);
    }
    setIsOpen(nextState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: T) => {
    if (!isControlled) setUncontrolledValue(val);
    setIsOpen(false);
    if (internalError) setInternalError(undefined);
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      handleToggle(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.root,
        className,
        required && styles.required,
        hasError && styles.negative,
        disabled && styles.disabled,
        isOpen && styles.isOpen,
        openUp && styles.openUp,
        styles['direction_' + direction],
      )}
      {...rest}
    >
      {label && (
        <div className={styles.labelWrapper}>
          <p className={styles.label}>{label}</p>
          {Icon && <Icon className={styles.icon} />}
          {tooltip && (
            <div className={styles.tooltipContainer} tabIndex={0}>
              <span className={styles.tooltipTrigger}>?</span>
              <div className={styles.tooltipBox}>{tooltip}</div>
            </div>
          )}
        </div>
      )}

      <div className={styles.selectWrapper}>
        <div
          className={clsx(
            styles.selectTrigger,
            selectedValue !== undefined && styles.filled,
          )}
          tabIndex={disabled ? -1 : 0}
          onClick={() => handleToggle()}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.triggerValue}>{selectedDisplay}</span>
          <div className={styles.arrowIcon} />
        </div>

        {isOpen && (
          <div className={styles.dropdownMenu} role="listbox">
            {options.map((item, idx) => {
              if ('items' in item) {
                return (
                  <div key={idx} className={styles.group}>
                    <div className={styles.groupLabel}>{item.groupLabel}</div>
                    {item.items.map((opt) => (
                      <div
                        key={opt.value}
                        className={clsx(
                          styles.option,
                          selectedValue === opt.value && styles.selected,
                        )}
                        onClick={() => handleSelect(opt.value)}
                        role="option"
                        aria-selected={selectedValue === opt.value}
                      >
                        {opt.display}
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div
                  key={item.value}
                  className={clsx(
                    styles.option,
                    selectedValue === item.value && styles.selected,
                  )}
                  onClick={() => handleSelect(item.value)}
                  role="option"
                  aria-selected={selectedValue === item.value}
                >
                  {item.display}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(currentError || helperText) && (
        <p className={clsx(styles.message, hasError && styles.errorMessage)}>
          {currentError || helperText}
        </p>
      )}
    </div>
  );
};

export const SelectBox = forwardRef(SelectBoxInner) as <
  T extends string | number,
>(
  props: SelectBoxProps<T> & { ref?: React.ForwardedRef<FormElementRef> },
) => ReactElement;
