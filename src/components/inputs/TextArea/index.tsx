'use client';
import '../../../styles/global.css';
import { useFormImperativeHandle } from '../../../hooks/useFormImperativeHandle';
import { FormElementRef } from '../../../types';
import clsx from 'clsx';
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './style.module.css';

interface TextAreaProps extends Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'onChange' | 'value'
> {
  label?: string;
  message?: string;
  negative?: boolean;
  charLimit?: number;
  value?: string;
  onChange?: (value: string) => void;
  validation?: (value: string) => string | undefined | null;
}

const TextArea = forwardRef<FormElementRef, TextAreaProps>(
  (
    {
      label,
      message,
      negative = false,
      className,
      required,
      charLimit,
      value = '',
      onChange,
      validation,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // 1. Internal state – replaces useSignal
    const [inputValue, setInputValue] = useState<string>(value);

    // 2. Sync if parent updates value
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // 3. Reusable form logic (unchanged)
    const { internalError, setInternalError } = useFormImperativeHandle({
      ref,
      containerRef,
      validation,
      getValue: () => inputValue,
      onFocus: () => inputRef.current?.focus({ preventScroll: true }),
    });

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const textContent = event.target.value;
      setInputValue(textContent);
      if (internalError) setInternalError(undefined);
      onChange?.(textContent);
    };

    const hasError = !!internalError || negative;
    const currentMessage = internalError || message;

    return (
      <div
        ref={containerRef}
        className={clsx(
          styles.root,
          className,
          required && styles.required,
          hasError && styles.negative,
        )}
      >
        {label && <p className={styles.label}>{label}</p>}

        <div className={styles.inputWrapper}>
          {charLimit !== undefined && (
            <p className={styles.counter}>{charLimit - inputValue.length}</p>
          )}

          <textarea
            ref={inputRef}
            className={styles.input}
            required={required}
            onChange={handleInputChange}
            value={inputValue}
            maxLength={charLimit}
            {...rest}
          />
        </div>

        {currentMessage && (
          <p className={clsx(styles.message, hasError && styles.errorMessage)}>
            {currentMessage}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export { TextArea };
