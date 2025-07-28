import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { mmkv } from '../mmkv';
import type { PumpLog } from '../types';

type LogsState = {
  logs: PumpLog[];
  add: (log: PumpLog) => void;
  clear: () => void;
};

export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      logs: [],
      add: (log) => set({ logs: [...get().logs, log] }),
      clear: () => set({ logs: [] }),
    }),
    {
      name: 'pumpLogs',
      storage: {
        getItem: (name) => {
          const value = mmkv.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          mmkv.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          mmkv.delete(name);
        },
      },
    },
  ),
);
