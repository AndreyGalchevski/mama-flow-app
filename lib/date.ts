import { format, isAfter, isToday, isTomorrow, subHours } from 'date-fns';
import { enUS, he, ru } from 'date-fns/locale';

import i18n from './i18n';

export const getDateLocale = () => {
  switch (i18n.locale) {
    case 'ru':
      return ru;
    case 'he':
      return he;
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

export const formatTimeHM = (hours: number, minutes: number): string => {
  const d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  const locale = getDateLocale();
  return format(d, 'p', { locale });
};
