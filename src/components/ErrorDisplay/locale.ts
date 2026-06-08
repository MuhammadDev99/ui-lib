export const errorDisplayLocale = {
  en: {
    title: 'Something went wrong',
    fallbackMessage: 'An unexpected error occurred. Please try again.',
    retry: 'Try Again',
    viewDetails: 'View Technical Details',
    hideDetails: 'Hide Details',
    digestId: 'Digest ID:',
  },
  ar: {
    title: 'حدث خطأ ما',
    fallbackMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
    viewDetails: 'عرض التفاصيل التقنية',
    hideDetails: 'إخفاء التفاصيل',
    digestId: 'معرف الملخص:',
  },
} as const;

export type ErrorDisplayLocale = typeof errorDisplayLocale;
