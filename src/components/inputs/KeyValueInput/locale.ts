export const keyValueInputLocale = {
  en: {
    label: 'Attributes',
    keyPlaceholder: 'Key (e.g. Color)',
    valuePlaceholder: 'Value (e.g. Red)',
    addButton: 'Add',
    removeLabel: 'Remove',
  },
  ar: {
    label: 'الخصائص',
    keyPlaceholder: 'المفتاح (مثال: اللون)',
    valuePlaceholder: 'القيمة (مثال: أحمر)',
    addButton: 'إضافة',
    removeLabel: 'حذف',
  },
} as const;

export type KeyValueInputLocale = typeof keyValueInputLocale;
