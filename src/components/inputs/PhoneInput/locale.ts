export const phoneInputLocale = {
  en: {
    label: 'Phone number',
    placeholder: 'Enter phone number',
    invalidMessage: 'Invalid phone number',
    validMessage: 'Valid phone number',
  },
  ar: {
    label: 'رقم الجوال',
    placeholder: '05X XXX XXXX',
    invalidMessage: 'رقم غير صحيح',
    validMessage: 'رقم صحيح',
  },
} as const;

export type PhoneInputLocale = typeof phoneInputLocale;
