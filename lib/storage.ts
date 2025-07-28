import { MMKV } from 'react-native-mmkv';

import type { PumpLog } from './types';

const storage = new MMKV();

const STORAGE_KEY = 'pumpLogs';

export const getPumpLogs = (): PumpLog[] => {
  const str = storage.getString(STORAGE_KEY);
  return str ? JSON.parse(str) : [];
};

export const savePumpLog = (entry: PumpLog): void => {
  const logs = getPumpLogs();
  logs.push(entry);
  storage.set(STORAGE_KEY, JSON.stringify(logs));
};

export const clearAllLogs = (): void => {
  storage.delete(STORAGE_KEY);
};
