'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import { LoaderCircleIcon } from 'lucide-react';
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
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    let nextLocale = DEFAULT_LOCALE;

    try {
      const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

      if (isLocale(storedLocale)) {
        nextLocale = storedLocale;
      } else {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      }
    } catch {
      nextLocale = DEFAULT_LOCALE;
    }

    const timeout = window.setTimeout(() => setLocaleState(nextLocale), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const effectiveLocale = locale ?? DEFAULT_LOCALE;
  const translator = useMemo(
    () =>
      createTranslator({
        locale: effectiveLocale,
        messages: messages[effectiveLocale],
        namespace: 'Workbench',
      }),
    [effectiveLocale],
  );

  const t = useCallback<LocaleContextValue['t']>(
    (key, values) => translator(key as never, values as never),
    [translator],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: effectiveLocale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);

        try {
          window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        } catch {
          // The UI can still switch language if persistent storage is unavailable.
        }
      },
      t,
    }),
    [effectiveLocale, t],
  );

  if (!locale) {
    return (
      <div className="bg-background text-foreground flex h-dvh items-center justify-center">
        <div role="status" aria-live="polite" className="flex items-center justify-center">
          <LoaderCircleIcon className="text-muted-foreground size-6 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading XMLoom</span>
        </div>
      </div>
    );
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleController() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error('useLocaleController must be used inside I18nProvider.');
  }

  return value;
}
