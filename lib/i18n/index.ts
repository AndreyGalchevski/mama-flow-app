import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './locales/en.json';

const i18n = new I18n({ en });

i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.enableFallback = true;

export default i18n;
