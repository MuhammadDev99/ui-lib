'use client';
import '../../../styles/global.css';
import { clampNumber } from '../../../utils';
import { useFormImperativeHandle } from '../../../hooks/useFormImperativeHandle';
import { FormElementRef } from '../../../types';
import clsx from 'clsx';
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './style.module.css';

interface NumberInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'type'
> {
  label?: string;
  message?: string;
  negative?: boolean;
  unit?: string;
  validation?: (value: string) => string | undefined | null;
  value?: string | number;
  defaultValue?: string | number;
  step?: number;
}

const NumberInput = forwardRef<FormElementRef, NumberInputProps>(
  (
    {
      label,
      message,
      negative = false,
      className,
      required,
      unit = '',
      value: controlledValue,
      defaultValue,
      disabled,
      validation,
      onChange,
      step = 1,
      ...rest
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Internal state (uncontrolled / controlled)
    const [internalValue, setInternalValue] = useState<string>(
      (controlledValue ?? defaultValue ?? '').toString(),
    );

    // 🟢 Ref that always mirrors the latest internalValue (avoids stale closures)
    const internalValueRef = useRef(internalValue);
    internalValueRef.current = internalValue;

    // Sync when controlled value changes externally
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue.toString());
      }
    }, [controlledValue]);

    const { internalError, setInternalError } = useFormImperativeHandle({
      ref,
      containerRef,
      validation,
      getValue: () => internalValueRef.current,
      onFocus: () => inputRef.current?.focus({ preventScroll: true }),
    });

    const currentError = internalError || (negative ? message : undefined);
    const hasError = !!internalError || negative;

    const min = rest.min !== undefined ? Number(rest.min) : -Infinity;
    const max = rest.max !== undefined ? Number(rest.max) : Infinity;

    // ───── Hold‑to‑repeat machinery ─────
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isHoldingRef = useRef(false); // prevent overlapping holds

    // Cleans up all timers
    const stopHold = useCallback(() => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
      isHoldingRef.current = false;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
      return () => stopHold();
    }, [stopHold]);

    // Get the current numeric value from the ref (always up‑to‑date)
    const getCurrentNumber = useCallback((): number => {
      const val = internalValueRef.current;
      if (val === '') return min > -Infinity ? min : 0;
      const num = Number(val);
      return isNaN(num) ? (min > -Infinity ? min : 0) : num;
    }, [min]);

    // Apply a new value and propagate onChange
    const applyChange = useCallback(
      (newValue: number) => {
        const clamped = clampNumber(newValue, min, max);
        const stringValue = clamped.toString();
        setInternalValue(stringValue);
        if (internalError) setInternalError(undefined);

        if (onChange) {
          const event = {
            target: { value: stringValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      },
      [min, max, internalError, setInternalError, onChange],
    );

    // Single step functions
    const increment = useCallback(() => {
      const current = getCurrentNumber();
      if (current < max) {
        applyChange(current + step);
      }
    }, [getCurrentNumber, max, step, applyChange]);

    const decrement = useCallback(() => {
      const current = getCurrentNumber();
      if (current > min) {
        applyChange(current - step);
      }
    }, [getCurrentNumber, min, step, applyChange]);

    // Start hold repeat – immediate step, then rapid
    const startHold = useCallback(
      (action: 'increment' | 'decrement') => {
        if (disabled || isHoldingRef.current) return;
        isHoldingRef.current = true;

        const actionFn = action === 'increment' ? increment : decrement;
        actionFn(); // first step immediately

        holdTimeoutRef.current = setTimeout(() => {
          holdIntervalRef.current = setInterval(() => {
            actionFn();
          }, 60); // rapid repeat
        }, 300); // initial delay
      },
      [disabled, increment, decrement],
    );

    // ───── Event handlers for the spin buttons ─────
    const onIncrementMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault(); // avoid focus / text selection
      startHold('increment');
    };

    const onDecrementMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      startHold('decrement');
    };

    const onButtonUp = useCallback(() => {
      stopHold();
    }, [stopHold]);

    // Handle manual typing changes
    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      if (internalError) setInternalError(undefined);

      if (rawValue === '') {
        setInternalValue('');
        onChange?.(event);
        return;
      }

      const numericValue = Number(rawValue);
      if (!isNaN(numericValue)) {
        const clamped = clampNumber(numericValue, min, max);
        setInternalValue(clamped.toString());
      } else {
        // Allow temporary invalid intermediate input (e.g., "-", "1e")
        setInternalValue(rawValue);
      }

      onChange?.(event);
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
        )}
      >
        {label && <p className={styles.label}>{label}</p>}

        <div className={styles.inputWrapper}>
          {unit && <p className={styles.unit}>{unit}</p>}
          <input
            ref={inputRef}
            className={styles.input}
            required={required}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            {...rest}
            onChange={handleValueChange}
            value={internalValue}
          />
          <div className={styles.spinnerButtons}>
            <button
              type="button"
              className={styles.spinButton}
              onMouseDown={onIncrementMouseDown}
              onMouseUp={onButtonUp}
              onMouseLeave={onButtonUp}
              onTouchStart={onIncrementMouseDown}
              onTouchEnd={onButtonUp}
              disabled={disabled}
              tabIndex={-1}
              aria-label="Increment"
            >
              <ChevronUp className={styles.spinIcon} />
            </button>
            <button
              type="button"
              className={styles.spinButton}
              onMouseDown={onDecrementMouseDown}
              onMouseUp={onButtonUp}
              onMouseLeave={onButtonUp}
              onTouchStart={onDecrementMouseDown}
              onTouchEnd={onButtonUp}
              disabled={disabled}
              tabIndex={-1}
              aria-label="Decrement"
            >
              <ChevronDown className={styles.spinIcon} />
            </button>
          </div>
        </div>

        {(currentError || message) && (
          <p className={clsx(styles.message, hasError && styles.errorMessage)}>
            {currentError || message}
          </p>
        )}
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
export { NumberInput };
