'use client';
import '../../../styles/global.css';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  ComponentPropsWithoutRef,
  useEffect,
} from 'react';
import clsx from 'clsx';
import { Phone, CircleAlert, CircleCheck } from 'lucide-react';
import { useLocale } from '../../../contexts/LocaleContext';
import { phoneInputLocale } from './locale';
import styles from './style.module.css';

export interface FormElementRef {
  value: string;
  error: string | undefined;
  validate: () => boolean;
  focus: () => void;
}

export interface ModernPhoneInputProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

// Global module placeholders for dynamic loading
let ReactPhoneInput: any = null;
let isValidPhoneNumberFn: any = null;
let isPossiblePhoneNumberFn: any = null;

const PhoneInput = forwardRef<FormElementRef, ModernPhoneInputProps>(
  (
    {
      className,
      value: externalValue,
      onChange,
      label,
      error: externalError,
      required = false,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const { locale } = useLocale();
    const t =
      phoneInputLocale[locale as keyof typeof phoneInputLocale] ??
      phoneInputLocale.en;

    const displayLabel = label ?? t.label;
    const displayPlaceholder = placeholder ?? t.placeholder;

    const [phoneNumber, setPhoneNumber] = useState(externalValue || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Client-side dynamic loader to bypass Server Component static evaluation
    useEffect(() => {
      Promise.all([
        import('react-phone-number-input'),
        import('react-phone-number-input/style.css' as any),
      ]).then(([mod]) => {
        ReactPhoneInput = mod.default;
        isValidPhoneNumberFn = mod.isValidPhoneNumber;
        isPossiblePhoneNumberFn = mod.isPossiblePhoneNumber;
        setIsLoaded(true);
      });
    }, []);

    useEffect(() => {
      if (externalValue !== undefined) {
        setPhoneNumber(externalValue);
      }
    }, [externalValue]);

    const checkValidity = (val: string) => {
      if (!val) return !required;
      if (isValidPhoneNumberFn) {
        return isValidPhoneNumberFn(val);
      }
      return val.length > 5; // Basic fallback validation before module hydration
    };

    const isLocalError = isTouched && isValid === false;
    const hasError = !!externalError || isLocalError;
    const displayError = externalError || t.invalidMessage;

    const handleChange = (val?: string) => {
      const currentPhone = val || '';
      setPhoneNumber(currentPhone);
      onChange?.(currentPhone);

      if (currentPhone) {
        if (isPossiblePhoneNumberFn) {
          setIsValid(isPossiblePhoneNumberFn(currentPhone));
        } else {
          setIsValid(currentPhone.length > 5);
        }
      } else {
        setIsValid(required ? false : null);
      }
    };

    const handleBlur = () => {
      setIsTouched(true);
      setIsValid(checkValidity(phoneNumber));
    };

    useImperativeHandle(ref, () => ({
      get value() {
        return phoneNumber || '';
      },
      get error() {
        return hasError ? displayError : undefined;
      },
      validate: () => {
        const isPhoneValid = checkValidity(phoneNumber);
        setIsValid(isPhoneValid);
        setIsTouched(true);
        return isPhoneValid;
      },
      focus: () => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        const input = containerRef.current?.querySelector('input');
        input?.focus({ preventScroll: true });
      },
    }));

    return (
      <div
        ref={containerRef}
        className={clsx(styles.container, className)}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        {...rest}
      >
        <div className={styles.labelWrapper}>
          <label className={styles.label}>
            {displayLabel}{' '}
            {required && <span className={styles.requiredStar}>*</span>}
          </label>
          <Phone className={styles.icon} />
        </div>

        <div
          className={clsx(
            styles.inputWrapper,
            hasError && styles.inputError,
            isTouched &&
              isValid === true &&
              phoneNumber &&
              !hasError &&
              styles.inputSuccess,
          )}
        >
          {isLoaded && ReactPhoneInput ? (
            <ReactPhoneInput
              international
              defaultCountry="SA"
              value={phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={styles.phoneInput}
              placeholder={displayPlaceholder}
            />
          ) : (
            // SSR Fallback element displayed while loading the client dependency
            <div className={styles.phoneInput}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                className="PhoneInputInput"
                placeholder={displayPlaceholder}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  padding: '0.6em 0.8em',
                  fontSize: '1em',
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.statusContainer}>
          {hasError && (
            <span className={styles.errorText}>
              <CircleAlert className={styles.statusIcon} />
              {displayError}
            </span>
          )}
          {isTouched && isValid === true && phoneNumber && !hasError && (
            <span className={styles.successText}>
              <CircleCheck className={styles.statusIcon} />
              {t.validMessage}
            </span>
          )}
        </div>
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
export { PhoneInput };
