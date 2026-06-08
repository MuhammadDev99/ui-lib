// packages\ui\src\components\Button\locale.ts
export const buttonLocale = {
  en: {
    loading: 'Loading...',
  },
  ar: {
    loading: 'جاري التحميل...',
  },
} as const;

export type ButtonLocale = typeof buttonLocale;
