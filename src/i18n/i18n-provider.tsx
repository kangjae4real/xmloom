'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import enMessages from '../../locales/en.json';
import koMessages from '../../locales/ko.json';

export const LOCALES = ['en', 'ko'] as const;
export type Locale = (typeof LOCALES)[number];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, number | string>) => string;
};

const DEFAULT_LOCALE: Locale = 'en';
const LOCALE_STORAGE_KEY = 'xmloom-locale';
const messages = {
  en: enMessages,
  ko: koMessages,
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

    if (isLocale(storedLocale)) {
      const timeout = window.setTimeout(() => setLocaleState(storedLocale), 0);

      return () => window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const translator = useMemo(
    () =>
      createTranslator({
        locale,
        messages: messages[locale],
        namespace: 'Workbench',
      }),
    [locale],
  );

  const t = useCallback<LocaleContextValue['t']>(
    (key, values) => translator(key as never, values as never),
    [translator],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      },
      t,
    }),
    [locale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleController() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error('useLocaleController must be used inside I18nProvider.');
  }

  return value;
}
