export const codeInputLocale = {
  en: {
    label: 'Verification Code (OTP)',
    errorTemplate: (length: number) => `Please enter ${length} digits`,
  },
  ar: {
    label: 'رمز التحقق (OTP)',
    errorTemplate: (length: number) => `يرجى إدخال ${length} أرقام`,
  },
} as const;

export type CodeInputLocale = typeof codeInputLocale;
