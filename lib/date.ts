import { format, isAfter, isToday, isTomorrow, subHours } from 'date-fns';

export const isInLast24Hours = (timestamp: number): boolean =>
  isAfter(timestamp, subHours(new Date(), 24));

export const formatNextReminder = (date: Date): string => {
  if (isToday(date)) {
    return `today at ${format(date, 'HH:mm')}`;
  }

  if (isTomorrow(date)) {
    return `tomorrow at ${format(date, 'HH:mm')}`;
  }

  return format(date, 'PPpp');
};
