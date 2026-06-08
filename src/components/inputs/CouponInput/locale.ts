export const couponInputLocale = {
  en: {
    label: 'Have a discount code?',
    placeholder: 'Enter coupon code',
    applyButtonText: 'Apply',
    loadingText: 'Loading...',
    successMessage: 'Discount applied successfully',
    defaultErrorMessage: 'An unexpected error occurred',
  },
  ar: {
    label: 'هل لديك كود خصم؟',
    placeholder: 'أدخل رمز القسيمة',
    applyButtonText: 'تطبيق',
    loadingText: 'جاري التحميل...',
    successMessage: 'تم تطبيق الخصم بنجاح',
    defaultErrorMessage: 'حدث خطأ غير متوقع',
  },
} as const;

export type CouponInputLocale = typeof couponInputLocale;
