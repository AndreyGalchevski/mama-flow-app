import { format, isAfter, isToday, isTomorrow, subHours } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

import i18n from './i18n';

export const getDateLocale = () => {
  switch (i18n.locale) {
    case 'ru':
      return ru;
    default:
      return enUS;
  }
};

export const isInLast24Hours = (timestamp: number): boolean =>
  isAfter(timestamp, subHours(new Date(), 24));

export const formatNextReminder = (date: Date): string => {
  const locale = getDateLocale();

  if (isToday(date)) {
    return i18n.t('time.today', { time: format(date, 'HH:mm', { locale }) });
  }

  if (isTomorrow(date)) {
    return i18n.t('time.tomorrow', { time: format(date, 'HH:mm', { locale }) });
  }

  return format(date, 'PPpp', { locale });
};
