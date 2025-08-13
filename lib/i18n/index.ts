import * as Localization from 'expo-localization';
import { I18n, useMakePlural } from 'i18n-js';
import {
  ar as arPluralizer,
  en as enPluralizer,
  he as hePluralizer,
  ru as ruPluralizer,
} from 'make-plural';

import ar from './locales/ar.json';
import en from './locales/en.json';
import he from './locales/he.json';
import ru from './locales/ru.json';

const i18n = new I18n({ en, he, ru, ar });

i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.pluralization.register('ar', useMakePlural({ pluralizer: arPluralizer }));
i18n.pluralization.register('en', useMakePlural({ pluralizer: enPluralizer }));
i18n.pluralization.register('he', useMakePlural({ pluralizer: hePluralizer }));
i18n.pluralization.register('ru', useMakePlural({ pluralizer: ruPluralizer }));

i18n.enableFallback = true;

const RTL_LANGUAGES = ['he', 'ar'];

export const isRTL = () => RTL_LANGUAGES.includes(i18n.locale);

export default i18n;
