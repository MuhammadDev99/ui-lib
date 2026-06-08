// packages\ui\src\contexts\LocaleContext.tsx
'use client';
import React, { createContext, useContext, useMemo } from 'react';

interface LocaleContextType {
  /** The active locale code, e.g. 'en', 'ar' */
  locale: string;
  /** Text direction derived from the locale */
  direction: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  direction: 'ltr',
});

interface LocaleProviderProps {
  /** The active locale code – used to pick the right translations */
  locale: string;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  // No messages, no overrides – just locale and direction
  const value = useMemo<LocaleContextType>(
    () => ({ locale, direction }),
    [locale, direction],
  );

  return (
    <LocaleContext.Provider value={value}>
      {/* <div dir={direction}>{children}</div> */}
      <>{children}</>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
