export type FormatOptions = {
  style?: 'full' | 'long' | 'medium' | 'short';
  showDate?: boolean;
  showTime?: boolean;
  useWesternArabicNumerals?: boolean;
};
export interface FormElementRef {
  value: string;
  error: string | undefined;
  validate: () => boolean;
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}
