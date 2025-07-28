import { isAfter, subHours } from 'date-fns';

export const isInLast24Hours = (timestamp: number) => isAfter(timestamp, subHours(new Date(), 24));
