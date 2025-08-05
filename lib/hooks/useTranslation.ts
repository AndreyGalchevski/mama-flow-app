import { getLocales } from 'expo-localization';
import { useMemo } from 'react';

import i18n from '../i18n';

type TranslationOptions = Record<string, string | number>;

export function useTranslation() {
  const locale = getLocales()[0]?.languageCode ?? 'en';

  return useMemo(() => {
    i18n.locale = locale;

    return (key: string, options?: TranslationOptions) => {
      return i18n.t(key, options);
    };
  }, [locale]);
}

export function translate(key: string, options?: TranslationOptions) {
  return i18n.t(key, options);
}
