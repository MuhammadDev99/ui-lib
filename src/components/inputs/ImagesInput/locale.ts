export const imagesInputLocale = {
  en: {
    label: 'Images',
    uploadFromDevice: 'Upload from device',
    limitReached: 'Limit reached',
    orAddUrl: 'Or add external link',
    urlPlaceholder: 'Enter image URL...',
    urlPlaceholderFull: 'Limit reached',
    addUrlButton: 'Add',
    badgeFile: 'File',
    badgeUrl: 'URL',
    emptyTitle: 'No images added yet',
    emptyDescription: 'Upload images that show the product details clearly',
    counter: (current: number, max?: number) =>
      max ? `(${current} / ${max})` : `(${current})`,
    maxLimitWarning: (max: number) => `You can only add up to ${max} images.`,
  },
  ar: {
    label: 'الصور',
    uploadFromDevice: 'رفع صور من الجهاز',
    limitReached: 'وصلت للحد الأقصى',
    orAddUrl: 'أو إضافة رابط خارجي',
    urlPlaceholder: 'أدخل رابط الصورة مباشر...',
    urlPlaceholderFull: 'تم الوصول للحد الأقصى',
    addUrlButton: 'إضافة',
    badgeFile: 'ملف',
    badgeUrl: 'رابط',
    emptyTitle: 'لم يتم إضافة صور للمنتج بعد',
    emptyDescription: 'ارفع صوراً تظهر تفاصيل المنتج بوضوح',
    counter: (current: number, max?: number) =>
      max ? `(${current} / ${max})` : `(${current})`,
    maxLimitWarning: (max: number) => `يمكنك إضافة ${max} صور فقط كحد أقصى.`,
  },
} as const;

export type ImagesInputLocale = typeof imagesInputLocale;
