'use client';
import { FormatOptions } from '../types';

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounced<Args extends unknown[]>(
  cb: (...args: Args) => void,
  delay: number = 300,
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function formatTime({
  time,
  language,
  options = {}, // Default to empty object if not provided
}: {
  time: Date | string | number;
  language: 'ar' | 'en';
  options?: FormatOptions; // Made optional here
}): string {
  const {
    style = 'medium',
    showDate = true,
    showTime = true,
    useWesternArabicNumerals = false,
  } = options;

  const date = new Date(time);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const intlOptions: Intl.DateTimeFormatOptions = {
    ...(showDate && { dateStyle: style }),
    ...(showTime && { timeStyle: style }),
  };

  let locale = language === 'ar' ? 'ar-EG' : 'en-US';

  if (language === 'ar' && useWesternArabicNumerals) {
    locale = 'ar-u-nu-latn';
  }

  return new Intl.DateTimeFormat(locale, intlOptions).format(date);
}

export function getProductLinkById(id: string): string {
  return '/product/' + id;
}

export function getClientLinkById(id: string): string {
  return '/dashboard/customer/' + id;
}
export function getReviewLinkById(id: string | number): string {
  return '/dashboard/review/' + id;
}
export function getOrderLinkById(id: string | number): string {
  return '/dashboard/order/' + id;
}
export function getCpuponLinkById(id: string | number): string {
  return '/dashboard/coupon/view/' + id;
}
export function getCouponEditLink(id: number): string {
  return '/dashboard/coupon/edit/' + id;
}
export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export function stringToRandom(
  text: string,
  min: number = 0,
  max: number = 1,
): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pseudoRandom = (Math.sin(hash) + 1) / 2;
  return min + pseudoRandom * (max - min);
}
