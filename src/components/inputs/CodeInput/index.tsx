'use client';
import '../../../styles/global.css';
import { useFormImperativeHandle } from '../../../hooks/useFormImperativeHandle';
import { FormElementRef } from '../../../types';
import clsx from 'clsx';
import {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  forwardRef,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { codeInputLocale } from './locale';
import styles from './style.module.css';

type Props = {
  length?: number;
  validation?: (value: string) => string | undefined | null;
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange'>;

const CodeInput = forwardRef<FormElementRef, Props>((props, ref) => {
  const { length = 6, className, validation, ...rest } = props;

  const { locale } = useLocale();
  const t =
    codeInputLocale[locale as keyof typeof codeInputLocale] ??
    codeInputLocale.en;

  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Built‑in validation message if none provided
  const defaultValidation = (val: string) =>
    val.length !== length ? t.errorTemplate(length) : null;

  const { internalError, setInternalError } = useFormImperativeHandle({
    ref,
    containerRef,
    getValue: () => code.join(''),
    validation: validation || defaultValidation,
    onFocus: () => inputRefs.current[0]?.focus({ preventScroll: true }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (internalError) setInternalError(undefined);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      if (internalError) setInternalError(undefined);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text/plain')
      .replace(/[^0-9]/g, '')
      .slice(0, length);
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    if (internalError) setInternalError(undefined);

    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div ref={containerRef} className={clsx(styles.root, className)} {...rest}>
      <label className={styles.label}>{t.label}</label>
      <div className={styles.inputsContainer} dir="ltr">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={clsx(styles.input, internalError && styles.inputError)}
          />
        ))}
      </div>
      {internalError && (
        <span className={styles.errorMessage}>{internalError}</span>
      )}
    </div>
  );
});

CodeInput.displayName = 'CodeInput';
export { CodeInput };
