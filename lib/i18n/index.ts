import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './locales/en.json';
import he from './locales/he.json';
import ru from './locales/ru.json';

const i18n = new I18n({ en, he, ru });

i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.enableFallback = true;

const RTL_LANGUAGES = ['he', 'ar'];

export const isRTL = () => RTL_LANGUAGES.includes(i18n.locale);

export default i18n;
